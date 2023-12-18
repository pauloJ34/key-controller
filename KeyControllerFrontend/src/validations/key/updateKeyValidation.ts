import { z } from 'zod';

export const updateKeyValidation = z.object({
  number: z.string().nonempty(),
  sectorId: z.string().nonempty().refine(Number),
});
