import { z } from 'zod';

export const updateSectorValidation = z.object({
  name: z.string().nonempty(),
});
