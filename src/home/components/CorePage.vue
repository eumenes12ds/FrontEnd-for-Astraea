<template>
  <div class="core-page">
    <h2 class="main-title">核心选择</h2>
    <p class="core-subtitle">
      跨越星海降临的异界灵魂，是你孤独残躯里唯一永恒的共振，也是你同生共死的命定之灵
    </p>

    <div class="control-panel-container">
      <div class="tab-content">
        <div class="control-group">
          <div v-if="isLoading" class="loading-text">正在加载核心列表...</div>
          <div v-else-if="coreOptions.length === 0" class="empty-text">未找到可用的核心</div>
          <div v-else class="list-detail-layout">
            <div class="item-list">
              <button
                v-for="core in coreOptions"
                :key="core.value"
                class="list-item"
                :class="{
                  'toggled-on': localCoreSelections.get(core.value),
                  selected: selectedCoreKey === core.value,
                }"
                @click="handleCoreClick(core.value)"
              >
                {{ core.label }}
              </button>
            </div>
            <div class="item-detail">
              <template v-if="selectedCoreKey && selectedCoreInfo">
                <h3 class="detail-name">{{ selectedCoreInfo.label }}</h3>
                <div v-if="selectedCoreInfo.note" class="detail-row detail-row-note">
                  <span
                    class="detail-value core-note-content"
                    v-html="renderMarkdown(selectedCoreInfo.note)"
                  ></span>
                </div>
                <div class="detail-actions">
                  <button
                    class="toggle-btn"
                    :class="{ 'toggled-on': localCoreSelections.get(selectedCoreKey) }"
                    @click="handleSelectCore(selectedCoreKey)"
                  >
                    {{ localCoreSelections.get(selectedCoreKey) ? '已选择' : '未选择' }}
                  </button>
                </div>
              </template>
              <div v-else class="detail-placeholder">请选择一个核心查看详情</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step-footer">
      <button
        class="nav-button"
        :disabled="enabledCoreCount !== 1 || isLoading || isSaving"
        @click="handleNext"
      >
        <span>{{ isSaving ? '启程中...' : '开始旅程' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  initialCoreState,
  loadCoreOptions as loadCoreOptionsService,
  saveChanges as saveChangesService,
  selectCore,
  type CoreOption,
} from '../services/CorePage';
import { renderMarkdown } from '../services/markdownRender';
import { saveOutputSelection } from '../services/outputMethod';
import { switchSwipe } from '../services/StartPage';

const isLoading = ref(false);
const isSaving = ref(false);
const coreOptions = ref<CoreOption[]>([...initialCoreState.coreOptions]);
const localCoreSelections = ref(new Map(initialCoreState.localCoreSelections));
const bookName = ref<string | null>(null);

// 选中查看详情的核心
const selectedCoreKey = ref<string | null>(null);

// 计算当前已启用的核心数量
const enabledCoreCount = computed(() => {
  let count = 0;
  for (const enabled of localCoreSelections.value.values()) {
    if (enabled) count++;
  }
  return count;
});

// 获取选中核心的详细信息
const selectedCoreInfo = computed(() => {
  if (!selectedCoreKey.value) return null;
  return coreOptions.value.find(core => core.value === selectedCoreKey.value) || null;
});

async function loadCoreOptions() {
  isLoading.value = true;
  try {
    const result = await loadCoreOptionsService();
    coreOptions.value = result.coreOptions;
    localCoreSelections.value = result.localCoreSelections;
    bookName.value = result.bookName;
  } catch (error) {
    console.error('加载核心列表失败:', error);
    coreOptions.value = [];
    localCoreSelections.value = new Map();
    bookName.value = null;
  } finally {
    isLoading.value = false;
  }
}

function handleSelectCore(coreValue: string) {
  localCoreSelections.value = selectCore(localCoreSelections.value, coreValue);
}

// 点击左侧核心 = 自动选择（单选式）+ 查看详情
function handleCoreClick(coreValue: string) {
  selectedCoreKey.value = coreValue;
  handleSelectCore(coreValue);
}

/**
 * 点击「开始旅程」：保存核心选择，自动判定 API 写输出方式，并切换到自定义开局
 */
async function handleNext() {
  isSaving.value = true;
  try {
    if (bookName.value) {
      coreOptions.value = await saveChangesService(
        coreOptions.value,
        localCoreSelections.value,
        bookName.value,
      );
    }
    await runStartSequence();
  } catch (error) {
    console.error('保存核心选择失败:', error);
  } finally {
    isSaving.value = false;
  }
}

async function runStartSequence() {
  // 1. 判定 API（额外API 或 主API）
  let api = '主API';
  try {
    const ext = (window.top as any)?.SillyTavern?.getContext?.().extensionSettings;
    const extra = ext?.mvu_settings?.['额外模型解析配置'];
    if (extra) {
      if (extra['模型来源'] && extra['模型来源'] !== '自定义') {
        api = '额外API';
      } else if (extra['api地址'] && extra['密钥'] && extra['模型名称']) {
        api = '额外API';
      }
    }
  } catch {
    /* ignore */
  }

  // 2. 写入变量输出方式
  await saveOutputSelection(api);

  // 3. 切换到自定义开局（swipe 1）
  await switchSwipe(1);
}

// 组件挂载时加载核心列表
onMounted(() => {
  loadCoreOptions();
});
</script>

<style scoped>
.main-title {
  font-family: var(--title-font);
  font-weight: 700;
  color: var(--title-color);
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 2.2em;
}

.core-subtitle {
  text-align: center;
  font-family: var(--body-font);
  color: var(--link-color);
  font-size: 0.95em;
  letter-spacing: 1px;
  margin: 0 0 20px 0;
}

.control-panel-container {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: rgba(50, 40, 26, 0.92);
  padding: 0;
  margin: 25px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-content {
  padding: 15px 20px;
}

.control-group {
  min-height: 200px;
}

/* ===== 列表-详情布局 ===== */
.list-detail-layout {
  display: flex;
  gap: 20px;
  height: 450px;
}

.item-list {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 10px;
  border-right: 1px solid var(--border-color);
  scrollbar-width: none;
}

.item-list::-webkit-scrollbar {
  width: 6px;
}

.item-list::-webkit-scrollbar-track {
  background: transparent;
}

.item-list::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.item-list:hover {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.item-list:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
}

.item-list:hover::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.list-item {
  font-family: var(--body-font);
  font-size: 0.95em;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: var(--item-bg-color);
  color: var(--text-color);
  text-align: left;
  width: 100%;
}

.list-item:hover {
  background-color: var(--item-bg-hover-color);
  border-color: var(--border-strong-color);
}

.list-item.selected {
  background-color: var(--item-bg-selected-color);
  border-color: var(--title-color);
  color: var(--title-color);
  font-weight: 500;
}

.list-item.toggled-on {
  border-left: 3px solid #a8842f;
}

.list-item.toggled-on.selected {
  border-left: 3px solid #a8842f;
}

/* 详情面板 */
.item-detail {
  flex: 1;
  padding: 10px 20px;
  height: 100%;
  max-height: 450px;
  overflow-y: auto;
  background-color: rgba(50, 40, 26, 0.85);
  border-radius: 0 6px 6px 0;
  min-width: 0;
}

.detail-name {
  font-family: var(--title-font);
  font-size: 1.4em;
  font-weight: 600;
  color: var(--title-color);
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border-color);
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
  font-size: 0.95em;
}

.detail-row-note {
  flex-direction: column;
}

.detail-value {
  flex: 1;
  color: var(--text-color);
}

/* Markdown 渲染后的备注内容 */
.core-note-content {
  line-height: 1.6;
  word-break: break-word;
  overflow-x: auto;
  max-width: 100%;
}

.core-note-content :deep(h1),
.core-note-content :deep(h2),
.core-note-content :deep(h3) {
  margin: 8px 0 4px 0;
  color: var(--title-color);
}

.core-note-content :deep(h1) {
  font-size: 1.2em;
}

.core-note-content :deep(h2) {
  font-size: 1.1em;
}

.core-note-content :deep(h3) {
  font-size: 1em;
}

.core-note-content :deep(ul) {
  margin: 4px 0;
  padding-left: 20px;
}

.core-note-content :deep(li) {
  margin-bottom: 2px;
}

.core-note-content :deep(code) {
  background-color: rgba(216, 182, 120, 0.14);
  color: #f0dfb8;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}

.core-note-content :deep(strong) {
  font-weight: 600;
}

.core-note-content :deep(a) {
  color: var(--title-color);
  text-decoration: underline;
}

.core-note-content :deep(hr) {
  border: none;
  border-top: 1px dashed var(--border-color);
  margin: 12px 0;
}

.core-note-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 0.9em;
  max-width: 100%;
}

.core-note-content :deep(th),
.core-note-content :deep(td) {
  border: 1px solid var(--border-color);
  padding: 6px 10px;
  text-align: left;
}

.core-note-content :deep(th) {
  background-color: rgba(0, 0, 0, 0.04);
  font-weight: 600;
}

.core-note-content :deep(tr:nth-child(even)) {
  background-color: rgba(0, 0, 0, 0.02);
}

.detail-actions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed var(--border-color);
}

.toggle-btn {
  font-family: var(--body-font);
  font-size: 0.95em;
  padding: 8px 20px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: rgba(58, 46, 30, 0.85);
  color: #e9dcc4;
}

.toggle-btn:hover {
  opacity: 0.9;
}

.toggle-btn.toggled-on {
  background-color: #5f4c30;
  color: #f2e8d2;
  border-color: #d8b678;
}

.detail-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 150px;
  color: var(--text-color);
  opacity: 0.6;
  font-size: 0.95em;
}

.loading-text,
.empty-text {
  font-size: 0.95em;
  color: #c9b98f;
  text-align: center;
  padding: 20px;
  opacity: 0.8;
}

.step-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--body-font);
  font-weight: 500;
  font-size: 1em;
  color: var(--title-color);
  background-color: var(--item-bg-color);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.nav-button:hover:not(:disabled) {
  background-color: var(--item-bg-hover-color);
  border-color: var(--border-strong-color);
  transform: translateY(-2px);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media screen and (max-width: 600px) {
  .main-title {
    font-size: 1.8em;
  }

  .list-detail-layout {
    flex-direction: column;
    height: auto;
  }

  .item-list {
    flex: none;
    height: auto;
    max-height: 150px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding-right: 0;
    padding-bottom: 10px;
  }

  .item-detail {
    height: auto;
    max-height: none;
    padding: 10px 0;
  }
}
</style>
