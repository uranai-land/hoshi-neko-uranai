const signMeta = {
  aries: { name: "牡羊座", symbol: "♈", dates: "3/21 - 4/19", image: "images/aries-cat-cutout.png", cat: "リン" },
  taurus: { name: "牡牛座", symbol: "♉", dates: "4/20 - 5/20", image: "images/taurus-cat-cutout.png", cat: "リリー" },
  gemini: { name: "双子座", symbol: "♊", dates: "5/21 - 6/21", image: "images/gemini-cat-cutout.png", cat: "リン" },
  cancer: { name: "蟹座", symbol: "♋", dates: "6/22 - 7/22", image: "images/cancer-cat-cutout.png", cat: "リリー" },
  leo: { name: "獅子座", symbol: "♌", dates: "7/23 - 8/22", image: "images/leo-cat-cutout.png", cat: "リン" },
  virgo: { name: "乙女座", symbol: "♍", dates: "8/23 - 9/22", image: "images/virgo-cat-cutout.png", cat: "リリー" },
  libra: { name: "天秤座", symbol: "♎", dates: "9/23 - 10/23", image: "images/libra-cat-cutout.png", cat: "リン" },
  scorpio: { name: "蠍座", symbol: "♏", dates: "10/24 - 11/22", image: "images/scorpio-cat-cutout.png", cat: "リリー" },
  sagittarius: { name: "射手座", symbol: "♐", dates: "11/23 - 12/21", image: "images/sagittarius-cat-cutout.png", cat: "リン" },
  capricorn: { name: "山羊座", symbol: "♑", dates: "12/22 - 1/19", image: "images/capricorn-cat-cutout.png", cat: "リリー" },
  aquarius: { name: "水瓶座", symbol: "♒", dates: "1/20 - 2/18", image: "images/aquarius-cat-cutout.png", cat: "リン" },
  pisces: { name: "魚座", symbol: "♓", dates: "2/19 - 3/20", image: "images/pisces-cat-cutout.png", cat: "リリー" }
};

const fortuneDataUrl = "./data/monthly-fortunes-2026-06_to_2027-05.json";
const signKeys = Object.keys(signMeta);
const zodiacList = document.querySelector("#zodiacList");
const fortuneDetail = document.querySelector("#fortuneDetail");

let currentFortunes = {};
let currentMonthLabel = "";

function toFortuneObject(source, signKey) {
  const meta = signMeta[signKey];

  return {
    ...meta,
    signKey,
    name: source.name || meta.name,
    dates: source.period || meta.dates,
    cat: source.cat || meta.cat,
    phrase: source.message || source.phrase || "",
    total: source.total || "",
    love: source.love || "",
    work: source.work || "",
    money: source.money || "",
    color: source.color || "",
    item: source.item || "",
    message: source.catMessage || source.advice || ""
  };
}

function buildMonthFortunes(monthText) {
  if (!monthText) {
    throw new Error("No monthly fortune data was found for the selected month.");
  }

  return signKeys.reduce((month, signKey) => {
    if (!monthText[signKey]) {
      throw new Error(`Missing fortune data for sign: ${signKey}`);
    }

    month[signKey] = toFortuneObject(monthText[signKey], signKey);
    return month;
  }, {});
}

function getCurrentMonthKeyJST() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit"
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;

  return `${year}-${month}`;
}

function getLatestMonthKey(monthlyFortunes) {
  const monthKeys = Object.keys(monthlyFortunes).sort();
  return monthKeys[monthKeys.length - 1];
}

function getActiveMonthKey(monthlyFortunes) {
  const currentMonthKey = getCurrentMonthKeyJST();
  return monthlyFortunes[currentMonthKey] ? currentMonthKey : getLatestMonthKey(monthlyFortunes);
}

function getMonthPeriodText(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return `${year}年${month}月の占い`;
}

function getCatFace(fortune) {
  return fortune.cat === "リリー"
    ? { src: "images/lily-face-normal.png", alt: "リリーの顔アイコン" }
    : { src: "images/rin-face-normal.png", alt: "リンの顔アイコン" };
}

function createZodiacButtons() {
  zodiacList.innerHTML = signKeys.map((signKey) => {
    const fortune = currentFortunes[signKey];

    return `
      <button class="zodiac-button" type="button" data-sign="${fortune.signKey}" aria-pressed="false">
        <span class="zodiac-icon-frame">
          <img src="${fortune.image}" alt="${fortune.name}の猫アイコン" class="zodiac-cat-image">
        </span>
        <span class="zodiac-name">${fortune.name}</span>
        <span class="zodiac-date">${fortune.dates}</span>
      </button>
    `;
  }).join("");
}

function updateFortune(signKey) {
  const fortune = currentFortunes[signKey] || currentFortunes.aries;
  const face = getCatFace(fortune);
  const messageClass = fortune.cat === "リリー" ? "lily-message" : "rin-message";

  fortuneDetail.innerHTML = `
    <div class="detail-top">
      <p class="detail-month">${currentMonthLabel}</p>
      <header class="detail-header">
        <div class="detail-title-area">
          <p class="detail-kicker">${fortune.cat}が読む今月の星</p>
          <h3>${fortune.symbol} ${fortune.name}</h3>
        </div>
        <figure class="detail-sign-image-wrap detail-zodiac-visual fortune-zodiac-visual">
          <img src="${fortune.image}" alt="${fortune.name}の猫アイコン" class="detail-sign-image detail-zodiac-image selected-zodiac-image fortune-zodiac-image">
        </figure>
      </header>
    </div>

    <div class="monthly-word">
      <strong>今月のひとこと</strong>
      <p class="summary">${fortune.phrase}</p>
    </div>

    <div class="fortune-grid">
      <div class="fortune-row">
        <strong>総合運</strong>
        <span>${fortune.total}</span>
      </div>
      <div class="fortune-row">
        <strong>恋愛運</strong>
        <span>${fortune.love}</span>
      </div>
      <div class="fortune-row">
        <strong>仕事運</strong>
        <span>${fortune.work}</span>
      </div>
      <div class="fortune-row">
        <strong>金運</strong>
        <span>${fortune.money}</span>
      </div>
      <div class="fortune-row">
        <strong>ラッキーカラー</strong>
        <span>${fortune.color}</span>
      </div>
      <div class="fortune-row">
        <strong>ラッキーアイテム</strong>
        <span>${fortune.item}</span>
      </div>
    </div>

    <div class="cat-message ${messageClass}">
      <img src="${face.src}" alt="${face.alt}" class="cat-message-icon">
      <p>${fortune.message}</p>
    </div>
  `;

  document.querySelectorAll(".zodiac-button").forEach((button) => {
    const isActive = button.dataset.sign === fortune.signKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function showLoadingState() {
  fortuneDetail.innerHTML = `
    <p class="detail-kicker">月の便りを準備中</p>
    <h3>今月のメッセージ</h3>
    <p class="detail-placeholder">リンとリリーが、今月の星を集めています。</p>
  `;
}

function showErrorState() {
  fortuneDetail.innerHTML = `
    <p class="detail-kicker">読み込みエラー</p>
    <h3>今月のメッセージ</h3>
    <p class="detail-placeholder">時間をおいて、もう一度ページを開いてみてください。</p>
  `;
}

async function initMonthlyFortunes() {
  showLoadingState();

  try {
    const response = await fetch(fortuneDataUrl);

    if (!response.ok) {
      throw new Error(`Failed to load fortune data: ${response.status}`);
    }

    const data = await response.json();
    const monthlyFortunes = data.monthlyFortunes || {};
    const currentMonthKey = getActiveMonthKey(monthlyFortunes);

    if (!currentMonthKey) {
      throw new Error("No monthly fortune keys were found in monthlyFortunes.");
    }

    currentFortunes = buildMonthFortunes(monthlyFortunes[currentMonthKey]);
    currentMonthLabel = getMonthPeriodText(currentMonthKey);
    createZodiacButtons();
    updateFortune("aries");
  } catch (error) {
    console.error(error);
    showErrorState();
  }
}

zodiacList.addEventListener("click", (event) => {
  const button = event.target.closest(".zodiac-button");

  if (!button) {
    return;
  }

  updateFortune(button.dataset.sign);
});

initMonthlyFortunes();
