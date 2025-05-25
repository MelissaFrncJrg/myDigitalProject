<template>
  <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
    <UFormField label="Note (1 à 5)" name="rating">
      <UInput v-model="form.rating" type="number" min="1" max="5" />
    </UFormField>

    <UFormField label="Commentaire" name="comment">
      <UTextarea v-model="form.comment" placeholder="Partage ton avis..." />
    </UFormField>

    <UButton type="submit" :disabled="loading" color="primary">Envoyer</UButton>

    <div v-if="success" class="text-green-500">{{ success }}</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
  </UForm>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useProjectService } from "@/services/projectService";

// Props
const props = defineProps<{
  projectId: number;
  initialData?: {
    rating: number;
    comment?: string;
  };
}>();

const emit = defineEmits<{
  (e: "submitted"): void;
}>();

// 🧩 Validation avec valibot
const schema = v.object({
  rating: v.pipe(v.number(), v.minValue(1, "Min 1"), v.maxValue(5, "Max 5")),
  comment: v.pipe(v.string(), v.minLength(3, "Le commentaire est trop court")),
});

type FormSchema = v.InferOutput<typeof schema>;
const form = reactive<FormSchema>({
  rating: props.initialData?.rating ?? 5,
  comment: props.initialData?.comment ?? "",
});

// 🔄 Met à jour le formulaire si initialData change
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.rating = newVal.rating;
      form.comment = newVal.comment || "";
    }
  },
  { deep: true, immediate: true }
);

const success = ref("");
const error = ref("");
const { createOrUpdateReview, loading } = useProjectService();

// 🎯 Submit
const onSubmit = async (event: FormSubmitEvent<FormSchema>) => {
  success.value = "";
  error.value = "";
  try {
    await createOrUpdateReview(props.projectId, event.data);
    success.value = "Merci pour votre avis !";
    emit("submitted");
  } catch (err: any) {
    error.value = err.message || "Erreur lors de l’envoi";
  }
};
</script>
