<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { isAddress } from 'viem';

const { isPro } = useProVersion();
const { createGroupConversation } = useCreateGroupConversation();
const { encryptorClient, isReadyToUse: isEncryptorReadyToUse } = useEncryptor();

const emit = defineEmits(['close']);

type InitialValuesType = {
  name: string;
  isOnlyCreatorAllowedToAddMembers: boolean;
  isEncrypted: boolean;
  members: string[];
};

const initialValues = ref<InitialValuesType>({
  name: '',
  isOnlyCreatorAllowedToAddMembers: true,
  isEncrypted: true,
  members: [],
});

const zodSchema = z.object({
  name: z.string().min(1, { message: "Name can't be empty" }),
  isOnlyCreatorAllowedToAddMembers: z.boolean(),
  isEncrypted: z.boolean(),
  members: z
    .string()
    .min(1, { message: 'Please enter an address' })
    .refine(isAddress, { message: 'Invalid member address' })
    .refine((address) => (initialValues.value.isEncrypted ? encryptorClient.isUserAddressInitialized(address) : true), {
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
  await createGroupConversation(values);
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

const isEncryptorWidgetVisible = computed(() => !isEncryptorReadyToUse.value && initialValues.value.isEncrypted);
</script>

<template>
  <ProWidget v-if="!isPro" class="mt-6" />
  <div v-else class="grid grid-cols-1 gap-4 p-8 pt-4">
    <div class="ms-auto">
      <Field v-slot="{ handleChange, handleBlur }" name="isEncrypted">
        <BaseSwitchBall
          v-model="initialValues.isEncrypted"
          :disabled="isSubmitting"
          label="Use Encryption"
          sublabel="For encrypted communication"
          color="primary"
          @update:model-value="handleChange"
          @blur="handleBlur"
        />
      </Field>
    </div>

    <!-- Encryptor widget -->
    <EncryptorWidget v-if="isEncryptorWidgetVisible" color="none" />
    <!-- Form -->
    <form v-show="!isEncryptorWidgetVisible" @submit.prevent="onSubmit">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="name">
            <BaseInput
              label="Name"
              placeholder="Enter conversation name"
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
          <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="isOnlyCreatorAllowedToAddMembers">
            <BaseCheckbox
              color="primary"
              label="Only creator can add new members"
              :model-value="field.value"
              :error="errorMessage"
              :disabled="isSubmitting"
              @update:model-value="handleChange"
              @blur="handleBlur"
            />
          </Field>
        </div>
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
            <span>Create</span>
          </BaseButtonAction>
        </div>
      </div>
    </form>
  </div>
</template>
