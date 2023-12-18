import { z } from 'zod';

export const createKeyValidation = z.object({
  number: z.string().nonempty(),
  sectorId: z.string().nonempty().refine(Number),
});
