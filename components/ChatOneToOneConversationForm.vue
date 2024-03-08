<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { isAddress } from 'viem';

const { createOneToOneConversation } = useChat();
const { encryptorClient, isReadyToUse: isEncryptorReadyToUse } = useEncryptor();

const emit = defineEmits(['close']);

const initialValues = ref({
  receiver: '',
});

const zodSchema = z.object({
  receiver: z
    .string()
    .min(1, { message: 'Please enter an address' })
    .refine(isAddress, { message: 'Invalid receiver address' })
    .refine((address) => encryptorClient.isUserAddressInitialized(address), {
      message:
        'Unfortunately, the recipient is not registered with Encryptor, and as a result, encrypted content cannot be sent to them. Please ensure the recipient is registered with Encryptor to enable encrypted communication.',
    }),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(zodSchema),
  initialValues,
});

const onSubmit = handleSubmit((values) => {
  createOneToOneConversation(values.receiver);
  closeModal();
  resetForm();
});

const closeModal = () => {
  emit('close');
};

const isEncryptorWidgetVisible = computed(() => !isEncryptorReadyToUse.value);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-8 pt-4">
    <!-- Encryptor widget -->
    <EncryptorWidget v-if="isEncryptorWidgetVisible" color="none" />
    <!-- Form -->
    <form v-show="!isEncryptorWidgetVisible" @submit.prevent="onSubmit">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="receiver">
            <BaseInput
              label="Receiver"
              placeholder="Enter recipient's address"
              icon="lucide:user"
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              type="text"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>
        </div>
        <div class="col-span-12">
          <BaseButtonAction
            :disabled="isSubmitting"
            :loading="isSubmitting"
            type="submit"
            color="primary"
            class="h-12 w-full items-center gap-2"
          >
            <Icon name="lucide:plus" class="h-5 w-5" />
            <span>Create</span>
          </BaseButtonAction>
        </div>
      </div>
    </form>
  </div>
</template>
