<script>
import { ProfileApiService } from "../services/profile-api.service.js";
import { useI18n } from 'vue-i18n';

export default {
  name: "data-view",
  data() {
    return {
      users: null,
    };
  },
  setup() {
    const { t, locale } = useI18n();

    function toggleLanguage() {
      locale.value = locale.value === 'en' ? 'es' : 'en';
      localStorage.setItem('app-lang', locale.value);
    }

    return { t, locale, toggleLanguage };
  },
  methods: {
    updateUser() {
      const apiService = new ProfileApiService();
      apiService.updateUser(this.user.id, this.user).then(response => {
        this.users = response.data;
      });
    }
  }
}
</script>

<template>
  <div class="p-5 flex flex-row flex-auto container z-1 container-data-view">
    <div>
      <!-- Botón para cambiar idioma -->
      <div class="flex justify-content-end mb-4">
        <button class="language-button" @click="toggleLanguage">
          🌐 {{ locale === 'es' ? 'Español' : 'English' }}
        </button>
      </div>

      <div class="font-medium text-xl mb-3">{{ t('profile.title') }}</div>
      <p class="m-0 mb-4 p-0 font-medium line-height-3 mr-3">
        {{ t('profile.subtitle') }}
      </p>

      <div class="surface-card p-4 shadow-2 border-round">
        <div class="grid formgrid p-fluid">
          <div class="field mb-4 col-12">
            <label for="nickname" class="font-medium">{{ t('profile.nickname') }}</label>
            <input id="nickname" type="text" class="p-inputtext p-component p-element" />
          </div>

          <div class="surface-100 mb-3 col-12" style="height: 2px"></div>

          <div class="field mb-4 col-12 md:col-6">
            <label for="bio" class="font-medium">{{ t('profile.bio') }}</label>
            <textarea id="bio" rows="5" class="p-inputtextarea p-inputtext p-component p-element p-inputtextarea-resizable" style="height: 119px; overflow: hidden;"></textarea>
          </div>

          <div class="field mb-4 col-12 md:col-6">
            <label for="avatar" class="font-medium">{{ t('profile.avatar') }}</label>
            <div class="flex align-items-center">
              <img src="https://blocks.primeng.org/assets/images/blocks/avatars/circle/avatar-f-4.png" class="mr-4" alt="avatar">
              <pv-file-upload id="avatar" mode="basic" name="avatar" url="./upload.php" accept="image/*" maxfilessize="100000"
                              styleclass="p-button-outlined p-button-plain" chooselabel="Upload image" class="p-element">
              </pv-file-upload>
            </div>
          </div>

          <div class="surface-100 mb-3 col-12" style="height: 2px"></div>

          <div class="field mb-4 col-12 md:col-6">
            <label for="email" class="font-medium">{{ t('profile.email') }}</label>
            <input id="email" type="text" class="p-inputtext p-component p-element">
          </div>

          <div class="surface-100 mb-3 col-12" style="height: 2px"></div>

          <div class="col-12">
            <pv-button pbutton pripple :label="t('profile.saveChanges')" class="p-element p-ripple w-auto mt-3 p-button p-component" @click="updateUser" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1500px;
  margin-left: 10rem;
  color: #495057;
}

.p-inputtext {
  background: #ffffff;
  border: 1px solid #ced4da;
  color: #000000;
}

.p-inputtextarea {
  border: 1px solid #ced4da;
}

.surface-card {
  background-color: #ffffff !important;
}

.surface-100 {
  background-color: #F5F5F5 !important;
}

.p-button {
  background-color: #6366f1;
}

.p-button-label {
  color: #ffffff;
}

.flex-row {
  justify-content: flex-end;
}

.language-button {
  background-color: #e2e8f0;
  border: 1px solid #cbd5e0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.language-button:hover {
  background-color: #cbd5e0;
}

@media (max-width: 860px) {
  .container-data-view {
    margin-top: 4rem;
  }
}
</style>
