<template>
  <div class="showcase-section">
    <!-- 序章展示区 -->
    <div class="showcase-banner">
      <div class="banner-ornament">❖</div>
      <p class="banner-title">序章 · 阿斯塔利亚</p>
      <p class="banner-sub">星光不问赶路人，命运偏爱执笔者</p>
      <p class="banner-hint">在下方选择一个核心，点亮它，然后点击「开始旅程」</p>
    </div>

    <!-- 合并后的信息面板 -->
    <details class="info-panel">
      <summary>
        <span>世界背景与相关信息</span>
        <span class="arrow-toggle">❖</span>
      </summary>
      <div class="info-content">
        <h3>阿斯塔利亚世界</h3>
        <p>
          小时候的你读过那样的故事吗？在剑与魔法的异世界中，幻想中的故事。一句澄澈而坚定的誓言，一段英雄的骑行，一页由凡人书写的史诗。
        </p>

        <div class="world-quote">“家园已在身后，世界尽在眼前。”</div>
        <div class="world-quote">
          “长夜将至，我从今开始守望，至死方休。我将不娶妻、不封地、不生子。我将不戴宝冠，不争荣宠。我将尽忠职守，生死于斯。我是黑暗中的利剑，长城上的守卫，抵御寒冷的烈焰，破晓时分的光线，唤醒眠者的号角，守护王国的坚盾。我将生命与荣耀献给守夜人，今夜如此，夜夜皆然。”
        </div>
        <div class="world-quote">
          “荣耀即吾命！”<br />
          “愿黑松长青，愿号角长鸣，愿理想闪耀如初，愿长剑锋利如故。”
        </div>

        <p>
          这里是阿斯塔利亚。“剑与魔法”、“诗与远方”、“历史与传说”、“生者与死者”、“英雄与史诗”、“神灵与命运”的世界。
        </p>
        <p>请拿起你梦中与儿时最浪漫的笔，亲自书写属于你自己的冒险故事吧。</p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.showcase-banner {
  padding: 14px 22px;
  text-align: center;
}

.showcase-banner .banner-ornament {
  color: var(--border-strong-color);
  font-size: 1.35em;
  line-height: 1;
  margin-bottom: 6px;
}

.showcase-banner .banner-title {
  font-family: var(--title-font);
  font-weight: 700;
  color: var(--title-color);
  font-size: 1.3em;
  letter-spacing: 0.14em;
  margin: 0 0 6px;
}

.showcase-banner .banner-sub {
  font-style: italic;
  color: #e2c68d;
  margin: 0 0 8px;
  font-size: 0.97em;
}

.showcase-banner .banner-hint {
  font-size: 0.9em;
  color: #f2e8d2;
  opacity: 1;
  margin: 0;
}

.info-panel {
  margin-bottom: 25px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--item-bg-color);
}

.info-panel > summary {
  font-family: var(--title-font);
  font-weight: 700;
  font-size: 1.1em;
  color: var(--title-color);
  background-color: rgba(58, 46, 30, 0.8);
  padding: 12px 20px;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.info-panel > summary::-webkit-details-marker {
  display: none;
}

.info-panel > summary:hover {
  background-color: rgba(78, 62, 40, 0.9);
}

.arrow-toggle {
  font-size: 0.8em;
  transition: transform 0.3s ease-out;
  display: inline-block;
}

.info-panel[open] > summary .arrow-toggle {
  transform: rotate(-90deg);
}

.info-content {
  padding: 15px 25px 25px 25px;
  line-height: 1.7;
  color: #e9dcc4;
  background-color: rgba(50, 40, 26, 0.9);
}

.info-content h3 {
  font-family: var(--title-font);
  color: var(--title-color);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 8px;
  margin: 25px 0 15px 0;
  font-size: 1.4em;
}

.info-content h3:first-child {
  margin-top: 5px;
}

.info-content p,
.info-content ul {
  margin: 0 0 1em 0;
}

.info-content ul {
  list-style: none;
  padding-left: 5px;
}

.info-content li {
  padding-left: 20px;
  position: relative;
}

.info-content li::before {
  content: '»';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--border-strong-color);
  font-weight: bold;
}

.info-content a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.info-content a:hover {
  text-decoration: underline;
  color: var(--title-color);
}

.world-quote {
  background-color: rgba(58, 46, 30, 0.55);
  border-left: 3px solid var(--border-strong-color);
  padding: 12px 18px;
  margin: 15px 0;
  font-style: normal;
  color: #f2e8d2;
  font-family: 'KaiTi', 'STKaiti', '楷体', var(--body-font);
  line-height: 1.6;
}
</style>
