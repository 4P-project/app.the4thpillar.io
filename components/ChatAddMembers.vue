<script setup lang="ts">
import { z } from 'zod';
import { isAddress } from 'viem';
import { Field, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

defineProps<{ open: boolean }>();

const { selectedConversation: conversation, addMembers } = useChat();
const { encryptorClient, isReadyToUse: isEncryptorReadyToUse } = useEncryptor();

const emit = defineEmits(['close']);

type InitialValuesType = {
  members: string[];
};

const initialValues = ref<InitialValuesType>({
  members: [''],
});

const zodSchema = z.object({
  members: z
    .string()
    .min(1, { message: 'Please enter an address' })
    .refine(isAddress, { message: 'Invalid member address' })
    .refine((address) => (conversation.value?.isEncrypted ? encryptorClient.isUserAddressInitialized(address) : true), {
      message:
        'Unfortunately, the member is not registered with Encryptor, and as a result, encrypted content cannot be sent to them. Please ensure the member is registered with Encryptor to enable encrypted communication.',
    })
    .array(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(zodSchema),
  initialValues,
});

const onSubmit = handleSubmit(async (values) => {
  await addMembers(values.members);
  closeModal();
  resetForm();
});

const addMember = () => {
  initialValues.value.members.push('');
};

const removeMember = (index: number) => {
  initialValues.value.members.splice(index, 1);
};

const closeModal = () => {
  emit('close');
};

const isEncryptorWidgetVisible = computed(() => !isEncryptorReadyToUse.value && conversation.value.isEncrypted);
</script>

<template>
  <ModalDialog :open="open" size="lg" @close="closeModal">
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-lg font-medium leading-6 text-muted-900 dark:text-white">Add members</h3>

        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <div class="p-4 pt-0 md:p-6 md:pt-0">
      <!-- Encryptor widget -->
      <EncryptorWidget v-if="isEncryptorWidgetVisible" color="none" />

      <!-- Form -->
      <form v-show="!isEncryptorWidgetVisible" @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 max-h-52 overflow-y-auto">
            <div v-for="(member, index) in initialValues.members" :key="index">
              <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" :name="`members[${index}]`">
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <BaseInput
                      label="Member"
                      placeholder="Enter member's address"
                      icon="lucide:user"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </div>
                  <BaseButtonClose shape="smooth" class="mt-6" @click.prevent="removeMember(index)" />
                </div>
              </Field>
            </div>
          </div>
          <div class="col-span-12 text-center">
            <BaseButton
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="button"
              class="h-12 items-center gap-2"
              @click.prevent="addMember"
            >
              <Icon name="lucide:plus" class="h-5 w-5" />
              <span>Add Member</span>
            </BaseButton>
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
              <span>Add members</span>
            </BaseButtonAction>
          </div>
        </div>
      </form>
    </div>
  </ModalDialog>
</template>
