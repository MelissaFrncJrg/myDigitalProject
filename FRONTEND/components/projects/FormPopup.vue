<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Titre du projet" name="title">
      <UInput v-model="state.title" />
    </UFormField>

    <UFormField label="Description" name="description">
      <UTextarea v-model="state.description" />
    </UFormField>

    <UFormField label="Statut" name="status">
      <USelect
        v-model="state.status"
        :items="statuses"
        option-attribute="label"
      />
    </UFormField>

    <UButton type="submit" class="w-full" :disabled="loading">
      {{ submitLabel }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: "",
      description: "",
      status: "in_progress",
    }),
  },
  loading: Boolean,
  submitLabel: {
    type: String,
    default: "Enregistrer",
  },
});

const emit = defineEmits(["submitted"]);

// 🔒 Validation schema
const schema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(3, "Le titre doit contenir au moins 3 caractères")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(10, "La description est trop courte")
  ),
  status: v.string(),
});

type Schema = v.InferOutput<typeof schema>;

// 🧾 State du formulaire (réactif)
const state = reactive<Schema>({
  title: props.initialData.title,
  description: props.initialData.description,
  status: props.initialData.status,
});

// 🔄 Si props changent (édition), on réinjecte dans le state
watch(
  () => props.initialData,
  (val) => {
    state.title = val.title;
    state.description = val.description;
    state.status = val.status;
  },
  { deep: true }
);

const statuses = [
  { label: "En cours", value: "in_progress" },
  { label: "Publié", value: "published" },
  { label: "Annulé", value: "canceled" },
];

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  emit("submitted", event.data);
};
</script>
