"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentHash = generateContentHash;
exports.scrapeReleaseNotes = scrapeReleaseNotes;
exports.parseReleaseNotes = parseReleaseNotes;
const crypto_1 = require("crypto");
const cheerio = __importStar(require("cheerio"));
const SOURCE_URL = "https://docs.anthropic.com/en/release-notes/overview";
/** コンテンツの SHA-256 ハッシュを生成する */
function generateContentHash(content) {
    return (0, crypto_1.createHash)("sha256").update(content).digest("hex");
}
/** Anthropic 公式リリースノートページを取得してパースする */
async function scrapeReleaseNotes() {
    const response = await fetch(SOURCE_URL, {
        headers: {
            "User-Agent": "ClaudeDigest/1.0 (changelog-aggregator)",
        },
    });
    if (!response.ok) {
        throw new Error(`スクレイピング失敗: HTTP ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    return parseReleaseNotes(html);
}
/** HTML をパースしてリリースノートエントリを抽出する */
function parseReleaseNotes(html) {
    const $ = cheerio.load(html);
    const entries = [];
    // リリースノートの各セクション（h2 または article で区切られている想定）
    $("article, section, [data-testid='release-note']").each((_, element) => {
        const $el = $(element);
        const title = $el.find("h2, h3").first().text().trim() ||
            $el.find("h1").first().text().trim();
        if (!title)
            return;
        const rawContent = $el.html() || "";
        const contentHash = generateContentHash(rawContent);
        // バージョン番号を抽出（例: "1.9.0", "v2.0"）
        const versionMatch = title.match(/v?(\d+\.\d+(?:\.\d+)?)/);
        const version = versionMatch ? versionMatch[1] : null;
        // 日付を抽出
        const dateText = $el.find("time").attr("datetime") ||
            $el.find("[class*='date']").text().trim() ||
            "";
        const publishedAt = dateText ? new Date(dateText) : new Date();
        entries.push({
            title,
            version,
            publishedAt,
            rawContent,
            contentHash,
            sourceUrl: SOURCE_URL,
        });
    });
    // article/section で見つからない場合は h2 ベースで分割
    if (entries.length === 0) {
        const h2s = $("h2");
        h2s.each((_, h2El) => {
            const $h2 = $(h2El);
            const title = $h2.text().trim();
            if (!title)
                return;
            // h2 の次の兄弟要素を次の h2 まで収集
            let rawContent = "";
            let $next = $h2.next();
            while ($next.length > 0 && !$next.is("h2")) {
                rawContent += $.html($next);
                $next = $next.next();
            }
            const contentHash = generateContentHash(title + rawContent);
            const versionMatch = title.match(/v?(\d+\.\d+(?:\.\d+)?)/);
            entries.push({
                title,
                version: versionMatch ? versionMatch[1] : null,
                publishedAt: new Date(),
                rawContent,
                contentHash,
                sourceUrl: SOURCE_URL,
            });
        });
    }
    return entries;
}
//# sourceMappingURL=anthropicScraper.js.map