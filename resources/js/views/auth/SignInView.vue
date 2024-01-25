<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useUsers } from "@/stores/user";

// Vuelidate, for more info and examples you can check out https://github.com/vuelidate/vuelidate
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

// Main store and Router
const store = useUsers();
const router = useRouter();

// Input state variables
const state = reactive({
  username: null,
  password: null,
});

// Validation rules
const rules = computed(() => {
  return {
    username: {
      required,
      email,
      minLength: minLength(3),
    },
    password: {
      required,
      minLength: minLength(5),
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    // notify user form is invalid
    return;
  }

  await store.login();

  // Go to dashboard
  router.push({ name: "backend-dashboard" });
}
</script>

<template>
  <!-- Page Content -->
  <div class="hero-static d-flex align-items-center">
    <div class="content">
      <div class="row justify-content-center push">
        <div class="col-md-8 col-lg-6 col-xl-4">
          <!-- Sign In Block -->
          <BaseBlock class="mb-0">
            <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
              <h1 class="h2 mb-1 text-center">Login</h1>

              <!-- Sign In Form -->
              <form @submit.prevent="onSubmit">
                <div class="py-3">
                  <div class="mb-4">
                    <label for="login-username" class="form-label">
                      Correo electrónico
                    </label>
                    <input
                      id="login-username"
                      type="text"
                      class="form-control form-control-alt form-control-lg"
                      name="login-username"
                      :class="{
                        'is-invalid': v$.username.$errors.length,
                      }"
                      v-model="state.username"
                      @blur="v$.username.$touch"
                    />

                    <div
                      v-for="error of v$.username.$errors"
                      :key="error.$uid"
                      class="invalid-feedback animated fadeIn"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                  <div class="mb-4">
                    <label for="login-password" class="form-label">
                      Contraseña
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      class="form-control form-control-alt form-control-lg"
                      name="login-password"
                      :class="{
                        'is-invalid': v$.password.$errors.length,
                      }"
                      v-model="state.password"
                      @blur="v$.password.$touch"
                    />
                    <div
                      v-for="error of v$.password.$errors"
                      :key="error.$uid"
                      class="invalid-feedback animated fadeIn"
                    >
                      {{ error.$message }}
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="login-remember"
                        name="login-remember" />
                      <label class="form-check-label" for="login-remember">Recordarme</label>
                    </div>
                  </div>
                </div>
                <div class="d-grid gap-2 mb-4">
                  <button type="submit" class="btn w-full btn-alt-primary">
                    Ingresar
                  </button>
                </div>
              </form>
              <!-- END Sign In Form -->
            </div>
          </BaseBlock>
          <!-- END Sign In Block -->
        </div>
      </div>
    </div>
  </div>
  <!-- END Page Content -->
</template>
