import { z } from 'zod';

export const formSchema = z.object({
    taskId: z.string().uuid(),
    status: z.enum(['APPROVE', 'REJECT']),
    rationale: z.string().min(5).max(500)
});
