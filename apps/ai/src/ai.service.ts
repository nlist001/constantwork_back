import { TaskDTO } from '@app/contract/todo';
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';


@Injectable()
export class AiService {

  private openai: OpenAI;
  private logger = new Logger('OpenAIService');


  constructor() {
    this.logger.verbose('baseURL: ', process.env.OPENAI_API_URL);
    this.logger.verbose('apiKey: ', process.env.OPENAI_API_KEY);
    
    this.openai = new OpenAI({
      baseURL: process.env.OPENAI_API_URL,
      apiKey: process.env.OPENAI_API_KEY, 
    });
  }

  private async getChatResponse(prompt: string, response_format?) {
    this.logger.verbose('getChatResponse: prompt: ',prompt, 'response_format: ',response_format)
    const response = await this.openai.chat.completions.create({
      model: 'gpt-5.4', 
      messages: [{ role: 'user', content: prompt }],
      response_format
    });
    this.logger.verbose('getChatResponse: response: ',response)

    console.log('ai response',response)

    return response.choices[0].message.content;
  }



  async breakOnSubtasks( task: TaskDTO ): Promise<unknown> {
    return {
      "tasks": [
        {
          "id": 1,
          "name": "Проанализировать требования к фильтрации задач",
          "description": "Определить поддерживаемые параметры фильтрации: статус, приоритет и срок, а также ожидаемое поведение фильтров при одиночном и комбинированном использовании."
        },
        {
          "id": 2,
          "name": "Проанализировать требования к текстовому поиску",
          "description": "Определить, как пользователь должен искать задачи по названию и описанию, включая поведение поля поиска, частичное совпадение и обработку пустого запроса."
        },
        {
          "id": 3,
          "name": "Спроектировать пользовательский интерфейс фильтров",
          "description": "Подготовить структуру интерфейса для выбора статуса, приоритета и срока, включая расположение элементов, состояние выбранных фильтров и возможность их сброса."
        },
        {
          "id": 4,
          "name": "Спроектировать пользовательский интерфейс текстового поиска",
          "description": "Определить внешний вид и поведение текстового поля поиска, включая placeholder, момент запуска поиска и очистку введенного текста."
        },
        {
          "id": 5,
          "name": "Реализовать логику фильтрации по статусу",
          "description": "Добавить механизм отбора задач по выбранному статусу и обеспечить корректное отображение только подходящих задач."
        },
        {
          "id": 6,
          "name": "Реализовать логику фильтрации по приоритету",
          "description": "Добавить механизм отбора задач по уровню приоритета и обеспечить корректную совместную работу с другими фильтрами."
        },
        {
          "id": 7,
          "name": "Реализовать логику фильтрации по сроку",
          "description": "Добавить механизм отбора задач по сроку выполнения, включая обработку актуальных, просроченных или заданных пользователем временных диапазонов."
        },
        {
          "id": 8,
          "name": "Реализовать текстовый поиск по названию задачи",
          "description": "Добавить поиск задач по совпадению текста в названии с учетом частичного вхождения поискового запроса."
        },
        {
          "id": 9,
          "name": "Реализовать текстовый поиск по описанию задачи",
          "description": "Добавить поиск задач по совпадению текста в описании и объединить результат с поиском по названию."
        },
        {
          "id": 10,
          "name": "Объединить фильтрацию и текстовый поиск",
          "description": "Обеспечить совместную работу фильтров и поля поиска, чтобы пользователь мог одновременно применять несколько условий отбора."
        },
        {
          "id": 11,
          "name": "Реализовать сброс фильтров и поискового запроса",
          "description": "Добавить возможность быстро очистить все выбранные фильтры и введенный текст поиска с возвратом полного списка задач."
        },
        {
          "id": 12,
          "name": "Покрыть функциональность тестами",
          "description": "Подготовить тест-кейсы для проверки фильтрации по каждому параметру, комбинированной фильтрации, текстового поиска и сценариев сброса."
        }
      ]
    };
  }


  async _breakOnSubtasks( task: TaskDTO ): Promise<unknown> {
    this.logger.verbose('breakOnSubtasks: task: ',task);
    
    const res = await this.getChatResponse(
      task.name+' '+task.description+' разбей на подзадачи и верни список tasks, подзадача содержит поля id, name, description, в формате JSON',
      {
        "type": "json_schema",
        "json_schema": {
          "name": "task_list",
          "strict": true,
          "schema": {
            "type": "object",
            "properties": {
              "tasks": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "description": { "type": "string" },
                  },
                  "required": ["name", "description"],
                  "additionalProperties": false
                }
              }
            },
            "required": ["tasks"],
            "additionalProperties": false
          }
        }
      }
    )
    const cleanJson = res?.replace(/^```json|```$/gm, '').trim();

    this.logger.verbose('breakOnSubtasks: res: ',cleanJson);

    return cleanJson && JSON.parse(cleanJson);
  }

}