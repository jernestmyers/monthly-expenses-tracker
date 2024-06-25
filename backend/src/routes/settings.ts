import { Request, Response, Router, NextFunction } from 'express';
import pool from '../db';
import { Category } from '../models/User';
import { authenticateJWT } from './auth';

const router = Router();

router.get('/payers', authenticateJWT, async (req: Request, res: Response) => {
  const user = req.user as { id: number; username: string };
  try {
    const client = await pool.connect();
    const payers = await client.query(`
    SELECT id, name FROM payers WHERE user_id = ${user.id}
  `);
    client.release();
    res.status(200).json(payers.rows);
  } catch (err) {}
});

router.get(
  '/categories',
  authenticateJWT,
  async (req: Request, res: Response) => {
    const user = req.user as { id: number; username: string };
    try {
      const client = await pool.connect();
      const userParentCategories = await client.query(`
                SELECT id, name FROM categories WHERE user_id = ${user.id} AND parent_id IS NULL
            `);
      const userSubcategories = await client.query(`
                SELECT id, name, parent_id FROM categories WHERE user_id = ${user.id} AND parent_id IS NOT null
            `);
      const categories = userParentCategories.rows.map((parentCategory) => {
        const hasSubcategories = userSubcategories.rows.find(
          (subcat) => subcat['parent_id'] === parentCategory.id,
        );
        if (hasSubcategories) {
          return {
            ...parentCategory,
            subcategories: userSubcategories.rows
              .filter((subcat) => subcat['parent_id'] === parentCategory.id)
              .map((cat) => ({
                id: cat.id,
                name: cat.name,
                parentId: parentCategory.id,
              })),
          };
        } else {
          return parentCategory;
        }
      });
      client.release();
      res.status(200).json(categories);
    } catch (err) {}
  },
);

router.post('/payers', authenticateJWT, async (req: Request, res: Response) => {
  const { payerNames } = req.body;
  if (!Array.isArray(payerNames) || !payerNames.length) {
    return res.status(400).send('Invalid request');
  }

  try {
    const user = req.user as { id: number; username: string };
    const { id } = user;
    const client = await pool.connect();

    Promise.all(
      payerNames.map(
        async (name) =>
          await client.query(
            'INSERT INTO payers (user_id, name) VALUES($1, $2) RETURNING id, name',
            [id, name],
          ),
      ),
    )
      .then((data) =>
        res.status(200).json({ createdPayers: data.map((d) => d.rows) }),
      )
      .catch((err) => console.log(err));
    client.release();
  } catch (err) {}
});

router.post(
  '/categories',
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { newCategories } = req.body;
    if (!Array.isArray(newCategories) || !newCategories.length) {
      return res.status(400).send('Invalid request');
    }

    try {
      const user = req.user as { id: number; username: string };
      const { id } = user;
      const client = await pool.connect();

      newCategories.forEach(async (cat) => {
        // create new categories
        const newOrUpdatedCategory = await client.query(
          `
                    INSERT INTO categories (user_id, name, parent_id)
                    VALUES ($1, $2, $3)
                    RETURNING id
                `,
          [id, cat.name, cat.parentId ?? null],
        );

        if ('subcategories' in cat && cat.subcategories.length) {
          const { subcategories } = cat;
          // @ts-ignore
          subcategories?.forEach(async (subcat) => {
            await client.query(
              `
                        INSERT INTO categories (user_id, name, parent_id)
                        VALUES ($1, $2, $3)
                      `,
              //@ts-ignore
              [id, subcat.name, newOrUpdatedCategory.rows[0].id],
            );
          });
        }
      });
    } catch (err) {}
  },
);

router.patch(
  '/payers',
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { payers } = req.body;
    if (!Array.isArray(payers) || !payers.length) {
      return res.status(400).send('Invalid request');
    }

    try {
      const client = await pool.connect();

      Promise.all(
        payers.map(
          async (payer) =>
            await client.query(
              'UPDATE payers SET name = $1 WHERE id = $2 RETURNING id, name',
              [payer.name, payer.id],
            ),
        ),
      )
        .then((data) =>
          res.status(200).json({ updatedPayers: data.map((d) => d.rows) }),
        )
        .catch((err) => console.log(err));
    } catch (err) {}
  },
);

router.patch(
  '/categories',
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { patchedCategories } = req.body;
    if (!Array.isArray(patchedCategories) || !patchedCategories.length) {
      return res.status(400).send('Invalid request');
    }

    try {
      const client = await pool.connect();

      Promise.all(
        patchedCategories.map(
          async (patchedCategory) =>
            await client.query(
              'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name',
              [patchedCategory.name, patchedCategory.id],
            ),
        ),
      )
        .then((data) =>
          res.status(200).json({ patchedCategories: data.map((d) => d.rows) }),
        )
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  },
);

router.delete(
  '/categories',
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).send('Invalid request');
    }
    const client = await pool.connect();
    Promise.all(
      ids.map(
        async (id) =>
          await client.query(
            'DELETE FROM categories WHERE id = $1 RETURNING id',
            [id],
          ),
      ),
    )
      .then((data) =>
        res.status(200).json({ deletedCategoryIds: data.map((d) => d.rows) }),
      )
      .catch((err) => console.log(err));
  },
);

router.delete(
  '/payers',
  authenticateJWT,
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).send('Invalid request');
    }
    const client = await pool.connect();
    Promise.all(
      ids.map(
        async (id) =>
          await client.query('DELETE FROM payers WHERE id = $1 RETURNING id', [
            id,
          ]),
      ),
    )
      .then((data) =>
        res.status(200).json({ deletedPayerIds: data.map((d) => d.rows) }),
      )
      .catch((err) => console.log(err));
  },
);

export default router;
