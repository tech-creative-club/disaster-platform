![Discord Member Count](https://flat.badgen.net/discord/members/SAFv8YkSFm)
![Github Star Count](https://flat.badgen.net/github/stars/tech-creative-club/disaster-platform)
![Github Last Commit](https://flat.badgen.net/github/last-commit/tech-creative-club/disaster-platform)

# Welcome to **disaster-platform**!
本プロジェクトは[技創くらぶ](https://github.com/tech-creative-club)が運営する災害時の統計情報表示サービスです。Xへ投稿された[ポスト](https://x.com/tec2soc/status/1741750140921389262?s=20)に共感した有志のエンジニアたちが運営を行なっています。

## 概要

### Goal and Value
プロジェクトのゴールとバリューについて紹介します。  
- **Goal**: 総合的な災害に対応可能な避難所運営者と被災者を繋ぐ要望集計アプリケーションを作成すること  
- **Value**: 
  - 避難所の物資不足・状況の共有を本サービスを用いて行うことにより対策の速度を上げることが可能になる
  - 避難所運営者が欲している情報を投票形式で分かりやすく被災者に対して集計を取ることができる
  
共感できる場合は、是非開発コミュニティに参加して議論へ積極的に参加していただけると幸いです。

### リポジトリの説明

- 本リポジトリでは、
  - 進捗管理
  - デプロイ
  - フロントエンド開発(forked from : [ttizze/mapprint-shelter](https://github.com/ttizze/mapprint-shelter))
- などを行っております。

## local development

### app開発

以下の手順でローカルの開発環境をスタートします。

1. `pnpm i`を実行し`node modules`を導入
1. `docker compose up -d`を実行しLocalDBを設定
1. `pnpx prisma generate`を実行しprismaクライアントを作成
1. `pnpm dev`を実行しNext.jsを起動する

### DB開発

※原文ママにしているので、誰か正確な言葉に直してください。

Preparation:

```
export POSTGRES_URL=postgresql://postgres:postgres@localhost:5433/postgres?schema=public
```

Usage:

Run docker-compose up to start the PostgreSQL container.
Execute pnpx prisma generate to generate Prisma Client code aligned with the Prisma schema.
Run pnpx prisma migrate dev to apply necessary migrations.
Use pnpx prisma db seed to incorporate initial data.

```
docker-compose up
pnpx prisma generate
pnpx prisma migrate dev
pnpx prisma db seed
```

Verification:

```
psql -h localhost -p 5433 -U postgres -d postgres
```

If tables are displayed, it's OK.

Tips:

You can use the command npx prisma studio to view the data added through the seed process.

## FAQ
**Q: [disaster-posts](https://github.com/tech-creative-club/disaster-posts)との違いは？**  
A: disaster-postsは災害時の掲示板を作成すること目的としていますが、本プロジェクトでは、被災者が必要とする物資などを統計情報を元に行政機関・ボランティアなどに対して提供することを目的としています。

**Q: 開発はどのような流れで行われているのか？**  
A: 本プロジェクトでは**Issue駆動開発**にて開発をおこなっています。原則としてプロジェクトに何らかの変更を加えたい場合、まずはIssueを立てることによって開発する意思があることを伝える必要があります。詳細は[開発の手引き](https://github.com/tech-creative-club/disaster-platform/blob/main/docs/CONTRIBUTING.md)をご覧ください。

**Q: X(Twitter)を見て来たが、どのように開発に参加すれば良いのか？**  
A: 興味を持って下さりありがとうございます。まずは[開発の手引き](https://github.com/tech-creative-club/disaster-platform/blob/main/docs/CONTRIBUTING.md)をご一読いただき、コミュニティにご参加ください。

## Join us
一緒に開発をしていただける仲間を常時募集中です。機能追加などの技術的な要素からドキュメント整備まで、幅広く人員を募集しています。興味がある方は[開発の手引き](https://github.com/tech-creative-club/disaster-platform/blob/main/docs/CONTRIBUTING.md)をご覧ください。

## License
Copyright (c) 2024 技創くらぶ  
Released under the [MIT](https://github.com/tech-creative-club/disaster-platform/blob/main/LICENSE) license.
