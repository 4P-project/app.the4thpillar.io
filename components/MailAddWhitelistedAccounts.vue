<script setup lang="ts">
import { z } from 'zod';
import { isAddress } from 'viem';
import { Field, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

defineProps<{
  open: boolean;
}>();

const { addAccounts } = useAddMailWhitelistAccounts();

const emit = defineEmits(['close']);

type InitialValuesType = {
  accounts: string[];
};

const initialValues = ref<InitialValuesType>({
  accounts: [''],
});

const zodSchema = z.object({
  accounts: z
    .string()
    .min(1, { message: 'Please enter an address' })
    .refine(isAddress, { message: 'Invalid account address' })
    .array(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(zodSchema),
  initialValues,
});

const onSubmit = handleSubmit(async (values) => {
  await addAccounts(values.accounts);
  closeModal();
  resetForm();
});

const addAccount = () => {
  initialValues.value.accounts.push('');
};

const removeAccount = (index: number) => {
  initialValues.value.accounts.splice(index, 1);
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <ModalDialog :open="open" size="lg" @close="closeModal">
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-lg font-medium leading-6 text-muted-900 dark:text-white">Add accounts</h3>

        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <div class="p-4 pt-0 md:p-6 md:pt-0">
      <!-- Form -->
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 max-h-52 overflow-y-auto">
            <div v-for="(account, index) in initialValues.accounts" :key="index">
              <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" :name="`accounts[${index}]`">
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <BaseInput
                      label="Account"
                      placeholder="Enter account's address"
                      icon="lucide:user"
                      :model-value="field.value"
                      :error="errorMessage"
                      :disabled="isSubmitting"
                      type="text"
                      @update:model-value="handleChange"
                      @blur="handleBlur"
                    />
                  </div>
                  <BaseButtonClose shape="smooth" class="mt-6" @click.prevent="removeAccount(index)" />
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
              @click.prevent="addAccount"
            >
              <Icon name="lucide:plus" class="h-5 w-5" />
              <span>Add Account</span>
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
              <span>Add Account</span>
            </BaseButtonAction>
          </div>
        </div>
      </form>
    </div>
  </ModalDialog>
</template>
