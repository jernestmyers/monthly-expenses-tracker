import { Request, Response, Router, NextFunction } from 'express';
import pool from '../db';
import { Category } from '../models/User';
import { authenticateJWT } from './auth';

const router = Router();

router.get('', authenticateJWT, async (req: Request, res: Response) => {
  const user = req.user as { id: number; username: string };
  try {
    const client = await pool.connect();
    const userParentCategories = await client.query(`
                SELECT id, name FROM categories WHERE user_id = ${user.id} AND parent_id IS NULL
            `);
    const userSubcategories = await client.query(`
                SELECT id, name, parent_id FROM categories WHERE user_id = ${user.id} AND parent_id IS NOT null
            `);
    const payers = await client.query(`
                SELECT id, name FROM payers WHERE user_id = ${user.id}
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
            .map((cat) => ({ id: cat.id, name: cat.name })),
        };
      } else {
        return parentCategory;
      }
    });
    res.status(200).json({
      categories,
      payers: payers.rows,
    });
  } catch (err) {}
});

router.post('', authenticateJWT, async (req: Request, res: Response) => {
  const { userCategories, payers } = req.body;
  // console.log(userCategories)
  if (
    !Array.isArray(userCategories) ||
    !Array.isArray(payers) ||
    !userCategories.length ||
    !payers.length
  ) {
    return res.status(400).send('Invalid input');
  }

  try {
    const user = req.user as { id: number; username: string };
    const { id } = user;
    const client = await pool.connect();

    // handle payers updates
    payers.forEach(async (payer) => {
      await client.query(
        `
                    INSERT INTO payers (user_id, name)
                    VALUES($1, $2)
                    ON CONFLICT (user_id, name)
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING *`,
        [id, payer.displayName],
      );
    });

    // handle category updates
    userCategories.forEach(async (cat) => {
      // create categories
      const newOrUpdatedCategory = await client.query(
        `
                    INSERT INTO categories (user_id, name, parent_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (user_id, name, parent_id)
                    DO UPDATE SET name = EXCLUDED.name
                    RETURNING *
                `,
        [id, cat.label, null],
      );

      console.log(newOrUpdatedCategory.rows[0]);

      if ('subcategories' in cat && cat.subcategories.length) {
        const { subcategories } = cat;
        //@ts-ignore
        subcategories.forEach(async (subcat) => {
          await client.query(
            `
                        INSERT INTO categories (user_id, name, parent_id)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (user_id, name, parent_id)
                        DO UPDATE SET name = EXCLUDED.name
                        RETURNING *`,
            //@ts-ignore
            [id, subcat.label, newOrUpdatedCategory.rows[0].id],
          );
        });
      }
    });
  } catch (err) {}
});

export default router;
