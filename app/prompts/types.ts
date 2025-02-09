import { Prompt, Reporter, Story } from "@prisma/client"

export type PromptWithRelations = Prompt & {
  Reporters?: Reporter[]
  Stories?: Story[]
}
