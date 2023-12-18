import { z } from 'zod';

export const createSectorValidation = z.object({
  name: z.string().nonempty(),
});
