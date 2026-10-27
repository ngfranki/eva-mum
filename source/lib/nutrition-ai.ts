import {z} from 'zod';
import {mealSchema,templateSchema} from './nutrition';
export const aiReplySchema=z.object({message:z.string().min(1).max(2500),action:z.discriminatedUnion('type',[
z.object({type:z.literal('none')}).strict(),
z.object({type:z.literal('addMeal'),value:mealSchema}).strict(),
z.object({type:z.literal('editMeal'),key:z.string(),value:mealSchema}).strict(),
z.object({type:z.literal('deleteMeal'),key:z.string()}).strict(),
z.object({type:z.literal('addTemplate'),value:templateSchema}).strict(),
z.object({type:z.literal('editTemplate'),key:z.string(),value:templateSchema}).strict()
])}).strict();
export type AIReply=z.infer<typeof aiReplySchema>;
