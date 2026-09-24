"use strict";

const TYPES = ["zukou", "fumikou", "osenkou"];
const NEWSLETTER_URL = "https://www.reservestock.jp/subscribe/118446?prev=true";
const REDIRECT_DELAY_MS = 10000;

const questions = [
  {
    text: "今、一番求めているものは？",
    weight: 3,
    answers: [
      ["自分自身を整えたい", "zukou"],
      ["良い流れやご縁を大切にしたい", "fumikou"],
      ["空間や気持ちをすっきりさせたい", "osenkou"]
    ]
  },
  {
    text: "こんなことを感じることはありますか？",
    weight: 2,
    answers: [
      ["人と会ったあと、どっと疲れることがある", "zukou"],
      ["仕事やお金の流れを良くしたいと思う", "fumikou"],
      ["家や部屋の空気を切り替えたいと思う", "osenkou"]
    ]
  },
  {
    text: "香りを使うなら、どんな使い方が好き？",
    weight: 2,
    answers: [
      ["自分自身に香りをまといたい", "zukou"],
      ["バッグや財布に入れて持ち歩きたい", "fumikou"],
      ["部屋で香りを焚いて楽しみたい", "osenkou"]
    ]
  },
  {
    text: "香りを取り入れたいタイミングは？",
    weight: 2,
    answers: [
      ["外出前や人に会う前", "zukou"],
      ["仕事中や普段の暮らしの中", "fumikou"],
      ["一日の終わりや静かに過ごす時間", "osenkou"]
    ]
  },
  {
    text: "次のうち、一番惹かれる言葉は？",
    weight: 2,
    answers: [
      ["自分軸", "zukou"],
      ["幸運・良縁", "fumikou"],
      ["浄化・瞑想", "osenkou"]
    ]
  },
  {
    text: "火を使うお香についてどう思いますか？",
    weight: 2,
    answers: [
      ["火を使わず、自分自身に使いたい", "zukou"],
      ["火を使わず、香りをそばに置きたい", "fumikou"],
      ["火を使って香りや煙を楽しみたい", "osenkou"]
    ]
  },
  {
    text: "今のあなたに一番近い願いは？",
    weight: 3,
    answers: [
      ["周りに振り回されず、自分らしくいたい", "zukou"],
      ["良いご縁や豊かさにつながる毎日を意識したい", "fumikou"],
      ["不要なものを手放し、気持ちをリセットしたい", "osenkou"]
    ]
  }
];

const results = {
  zukou: {
    name: "塗香（ずこう）",
    shareName: "塗香",
    catch: "香りをまとう、小さなお守り。",
    image: "images/zukou.jpg",
    alt: "花模様が描かれた黒い塗香入れ",
    description: "今のあなたは、周りに合わせることよりも、まず自分自身を整える時間を必要としているのかもしれません。\n\n塗香は、火を使わずに自分自身にまとうお香。人と会う前や仕事を始める前など、自分に意識を戻す小さな習慣として楽しめます。",
    reason: "今回の回答では「自分を整える」「自分軸」「自分を守る」という傾向が強く表れました。",
    uses: ["朝のお出かけ前に", "人と会う前に", "仕事を始める前に", "気持ちを切り替えたいときに"]
  },
  fumikou: {
    name: "文香（ふみこう）",
    shareName: "文香",
    catch: "幸運を願う香りを、いつもそばに。",
    image: "images/fumikou.jpg",
    alt: "色とりどりの折り紙で作られた文香",
    description: "今のあなたは、日常の中に心地よい香りを取り入れながら、良い流れやご縁を大切にしたい時期なのかもしれません。\n\n文香は、香りを小さな包みに入れて楽しむお香。財布やバッグ、名刺入れ、引き出しなど、身近な場所にそっと忍ばせることができます。",
    reason: "今回の回答では「良い流れ」「ご縁」「豊かさ」「香りをそばに置きたい」という傾向が強く表れました。",
    uses: ["お財布に", "バッグに", "名刺入れに", "仕事机の引き出しに", "大切な人への小さな贈り物に"]
  },
  osenkou: {
    name: "お線香",
    shareName: "お線香",
    catch: "香りと煙で、空間と心を切り替える。",
    image: "images/osenkou.jpg",
    alt: "白い花のそばで静かに煙を立てるお線香",
    description: "今のあなたは、一度立ち止まって余計なものを手放し、静かな時間を必要としているのかもしれません。\n\nお線香に火を灯し、ゆっくり立ちのぼる香りを感じる時間は、日常から少し離れて自分と向き合うきっかけになります。",
    reason: "今回の回答では「浄化」「気持ちの切り替え」「瞑想」「空間を整える」という傾向が強く表れました。",
    uses: ["朝のスタートに", "一日の終わりに", "瞑想するときに", "部屋の空気を切り替えたいときに", "自分と静かに向き合いたいときに"]
  }
};

const screens = {
  start: document.querySelector("#start-screen"),
  quiz: document.querySelector("#quiz-screen"),
  result: document.querySelector("#result-screen")
};
const ui = {
  currentStep: document.querySelector("#current-step"),
  progressBar: document.querySelector("#progress-bar"),
  questionPanel: document.querySelector("#question-panel"),
  questionTitle: document.querySelector("#question-title"),
  answerList: document.querySelector("#answer-list"),
  backButton: document.querySelector("#back-button"),
  shareStatus: document.querySelector("#share-status")
};

let currentQuestion = 0;
let answers = Array(questions.length).fill(null);
let currentResult = null;
let newsletterRedirectTimer = null;

function cancelNewsletterRedirect() {
  if (newsletterRedirectTimer !== null) {
    window.clearTimeout(newsletterRedirectTimer);
    newsletterRedirectTimer = null;
  }
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
  document.querySelector("#app").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const question = questions[currentQuestion];
  ui.currentStep.textContent = currentQuestion + 1;
  ui.progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  ui.questionTitle.textContent = question.text;
  ui.backButton.disabled = currentQuestion === 0;
  ui.answerList.replaceChildren();

  question.answers.forEach(([label, type], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.dataset.letter = String.fromCharCode(65 + index);
    button.textContent = label;
    button.setAttribute("aria-pressed", String(answers[currentQuestion] === type));
    button.addEventListener("click", () => selectAnswer(type));
    ui.answerList.appendChild(button);
  });

  ui.questionPanel.style.animation = "none";
  requestAnimationFrame(() => { ui.questionPanel.style.animation = "reveal .4s ease both"; });
}

function selectAnswer(type) {
  answers[currentQuestion] = type;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResult(determineResult(answers));
  }
}

// 同点時は Q1 → Q7 → 塗香・文香・お線香の順で決定する。
function determineResult(selectedAnswers) {
  const scores = { zukou: 0, fumikou: 0, osenkou: 0 };
  selectedAnswers.forEach((type, index) => {
    if (type) scores[type] += questions[index].weight;
  });

  const maxScore = Math.max(...Object.values(scores));
  let tied = TYPES.filter(type => scores[type] === maxScore);
  if (tied.length === 1) return tied[0];

  if (tied.includes(selectedAnswers[0])) return selectedAnswers[0];
  if (tied.includes(selectedAnswers[6])) return selectedAnswers[6];
  return TYPES.find(type => tied.includes(type));
}

function showResult(type) {
  currentResult = type;
  const result = results[type];
  const image = document.querySelector("#result-image");
  image.src = result.image;
  image.alt = result.alt;
  image.dataset.result = type;
  document.querySelector("#result-title").textContent = result.name;
  document.querySelector("#result-catch").textContent = result.catch;
  document.querySelector("#result-description").textContent = result.description;
  document.querySelector("#result-reason").textContent = result.reason;
  document.querySelector("#result-uses").replaceChildren(...result.uses.map(use => {
    const item = document.createElement("li");
    item.textContent = use;
    return item;
  }));
  document.querySelector("#fire-note").hidden = type !== "osenkou";
  ui.shareStatus.textContent = "";
  document.querySelector("#redirect-status").textContent = "10秒後に登録ページへ移動します。";
  document.querySelector("#newsletter-link").href = NEWSLETTER_URL;
  showScreen("result");
  cancelNewsletterRedirect();
  newsletterRedirectTimer = window.setTimeout(() => {
    window.location.assign(NEWSLETTER_URL);
  }, REDIRECT_DELAY_MS);
}

async function shareResult() {
  cancelNewsletterRedirect();
  const result = results[currentResult];
  const shareData = {
    title: "あなたに合うお香診断",
    text: `私におすすめのお香は「${result.shareName}」でした。あなたに合うお香も診断してみませんか？`,
    url: window.location.href.split("#")[0]
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      ui.shareStatus.textContent = "共有画面を開きました。";
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      ui.shareStatus.textContent = "診断結果をコピーしました。";
    } else {
      window.prompt("この文章をコピーしてシェアしてください", `${shareData.text}\n${shareData.url}`);
    }
  } catch (error) {
    if (error.name !== "AbortError") ui.shareStatus.textContent = "共有できませんでした。もう一度お試しください。";
  }
}

function restart() {
  cancelNewsletterRedirect();
  answers = Array(questions.length).fill(null);
  currentQuestion = 0;
  currentResult = null;
  showScreen("start");
}

document.querySelector("#start-button").addEventListener("click", () => {
  currentQuestion = 0;
  renderQuestion();
  showScreen("quiz");
});
ui.backButton.addEventListener("click", () => {
  if (currentQuestion === 0) return;
  currentQuestion -= 1;
  renderQuestion();
});
document.querySelector("#restart-button").addEventListener("click", restart);
document.querySelector("#share-button").addEventListener("click", shareResult);
document.querySelector("#stay-button").addEventListener("click", () => {
  cancelNewsletterRedirect();
  document.querySelector("#redirect-status").textContent = "このページにとどまり、診断結果を読み続けられます。";
});
document.querySelector("#newsletter-link").addEventListener("click", cancelNewsletterRedirect);

// Node-based smoke tests can import the pure scoring function without changing the browser experience.
if (typeof module !== "undefined" && module.exports) module.exports = { determineResult, questions };
