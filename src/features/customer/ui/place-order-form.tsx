import {
  Checkbox,
  FileButton,
  Group,
  NumberInput,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import {
  ORDER_MATERIAL_SOURCE_OPTIONS,
  PLACEMENT_TYPE_OPTIONS,
  REWRITE_TYPE_OPTIONS,
  TIMEZONE_REGION_OPTIONS,
  type PlaceOrderFormValues,
} from '../model/place-order-form';

type PlaceOrderFormProps = {
  values: PlaceOrderFormValues;
  onFieldChange: <K extends keyof PlaceOrderFormValues>(
    field: K,
    value: PlaceOrderFormValues[K],
  ) => void;
};

const PlaceOrderForm = ({ values, onFieldChange }: PlaceOrderFormProps) => {
  return (
    <>
      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>Материал</Title>

          <Stack gap="md">
            <SegmentedControl
              value={values.materialSource}
              onChange={(value) =>
                onFieldChange('materialSource', value as PlaceOrderFormValues['materialSource'])
              }
              data={ORDER_MATERIAL_SOURCE_OPTIONS}
            />

            {values.materialSource === 'link' ? (
              <TextInput
                label="Ссылка на материал"
                placeholder="https://example.com/news/article"
                value={values.newsUrl}
                onChange={(event) => onFieldChange('newsUrl', event.currentTarget.value)}
                required
              />
            ) : null}

            {values.materialSource === 'document' ? (
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Документ
                </Text>
                <Group gap="sm">
                  <FileButton
                    onChange={(file) =>
                      onFieldChange('documentName', file?.name ?? '')
                    }
                    accept=".doc,.docx,.pdf,.txt,.rtf"
                  >
                    {(props) => (
                      <TextInput
                        {...props}
                        readOnly
                        placeholder="Выберите файл"
                        value={values.documentName}
                        style={{ flex: 1 }}
                      />
                    )}
                  </FileButton>
                </Group>
              </Stack>
            ) : null}

            {values.materialSource === 'images' ? (
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Изображения
                </Text>
                <FileButton
                  onChange={(files) =>
                    onFieldChange(
                      'documentName',
                      files?.map((file) => file.name).join(', ') ?? '',
                    )
                  }
                  accept="image/*"
                  multiple
                >
                  {(props) => (
                    <TextInput
                      {...props}
                      readOnly
                      placeholder="Выберите изображения"
                      value={values.documentName}
                    />
                  )}
                </FileButton>
              </Stack>
            ) : null}

            <Textarea
              label="Описание заказа"
              placeholder="Кратко опишите задачу, аудиторию и пожелания к размещению"
              value={values.description}
              onChange={(event) => onFieldChange('description', event.currentTarget.value)}
              minRows={3}
              autosize
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>Текст и рерайт</Title>

          <Stack gap="md">
            <Textarea
              label="Заголовки / ключевые слова"
              placeholder="По смыслу или как в первоисточнике"
              value={values.keywords}
              onChange={(event) => onFieldChange('keywords', event.currentTarget.value)}
              minRows={2}
              autosize
            />

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <Select
                label="Тип рерайта"
                data={REWRITE_TYPE_OPTIONS}
                value={values.rewriteType}
                onChange={(value) => onFieldChange('rewriteType', value ?? 'Легкий')}
                allowDeselect={false}
              />
              <Select
                label="Тип размещения"
                data={PLACEMENT_TYPE_OPTIONS}
                value={values.placementType}
                onChange={(value) => onFieldChange('placementType', value ?? 'PR-волна')}
                allowDeselect={false}
              />
              <NumberInput
                label="Правка текста, %"
                placeholder="Не указано"
                value={values.textEditPercent}
                onChange={(value) =>
                  onFieldChange(
                    'textEditPercent',
                    value === '' || value === undefined ? '' : Number(value),
                  )
                }
                min={0}
                max={100}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Checkbox
                label="Нужна ссылка на источник"
                checked={values.hasSourceLink}
                onChange={(event) =>
                  onFieldChange('hasSourceLink', event.currentTarget.checked)
                }
              />
              <Checkbox
                label="Возможна полная перепечатка"
                checked={values.canFullReprint}
                onChange={(event) =>
                  onFieldChange('canFullReprint', event.currentTarget.checked)
                }
              />
            </SimpleGrid>
          </Stack>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>Реклама и маркировка</Title>

          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Checkbox
                label="Подпись «на правах рекламы»"
                checked={values.hasAdSignature}
                onChange={(event) =>
                  onFieldChange('hasAdSignature', event.currentTarget.checked)
                }
              />
              <Checkbox
                label="Нужна рецензия"
                checked={values.needsReview}
                onChange={(event) =>
                  onFieldChange('needsReview', event.currentTarget.checked)
                }
              />
            </SimpleGrid>

            <TextInput
              label="ERID"
              placeholder="Идентификатор маркировки рекламы"
              value={values.erid}
              onChange={(event) => onFieldChange('erid', event.currentTarget.value)}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="lg">
          <Title order={4}>Сроки и регион</Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Select
              label="Регион публикации"
              data={TIMEZONE_REGION_OPTIONS}
              value={values.timezoneRegion}
              onChange={(value) =>
                onFieldChange('timezoneRegion', value ?? 'Москва (UTC+3)')
              }
              allowDeselect={false}
            />
            <NumberInput
              label="Время на размещение, часы"
              value={values.placementDeadlineHours}
              onChange={(value) =>
                onFieldChange(
                  'placementDeadlineHours',
                  value === '' || value === undefined ? '' : Number(value),
                )
              }
              min={1}
              max={720}
            />
          </SimpleGrid>
        </Stack>
      </Paper>
    </>
  );
};

export { PlaceOrderForm };
