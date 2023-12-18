import { z } from 'zod';

export const createScheduleValidation = z
  .object({
    sectorId: z.string().nonempty().refine(Number),
    keyId: z.string().nonempty().refine(Number),
    acquisitionDate: z.string().nonempty().refine(Date),
    devolutionDate: z.string().nonempty().refine(Date),
  })
  .refine(
    (data) =>
      new Date(data.devolutionDate).getTime() > new Date(data.acquisitionDate).getTime(),
    {
      path: ['devolutionDate'],
      message: 'Devolution date cant be before acquisition date',
    }
  );
