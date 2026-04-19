# 状態管理連絡アプリ

## セットアップ

### 前提
- Python 3.10（pyenv/venv対応）
- Node.js（推奨: bun または npm/yarn）

### 1. リポジトリのクローン
```
git clone <このリポジトリのURL>
cd Sonzai
```

### 2. backend セットアップ
```
cd backend
# pyenvでPython 3.10.6を有効化
pyenv local 3.10.6
# 仮想環境作成（必要なら）
python -m venv venv
source venv/bin/activate
# 必要パッケージのインストール
pip install -r requirements.txt
```

### 3. frontend セットアップ
```
cd frontend
bun install # または npm install / yarn install
```

## 機能
- ユーザー認証（JWT）
- グループ作成・管理
- ステータス投稿・閲覧
- 他ユーザーの状態確認
- レスポンシブなUI

## 使い方
1. サインアップ/ログイン
2. グループを作成しメンバーを招待
3. ステータスを投稿
4. 他のメンバーの状態を確認

## ディレクトリ構成

```
Sonzai/
├── backend/   # FastAPI, SQLAlchemy, JWT 認証
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── db.py
│   ├── login.py
│   └── ...
├── frontend/  # Next.js (App Router), bun 対応
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── type/
│   ├── lib/
│   └── ...
└── README.md  # このファイル
```

### backend
- Python (FastAPI, SQLAlchemy, JWT, etc.)
- APIサーバー
- DB接続・認証・CRUD

### frontend
- Next.js (App Router)
- Zustand等による状態管理
- APIとの連携
- UIコンポーネント

---

ご不明点は各ディレクトリのREADMEやコメントをご参照ください。
