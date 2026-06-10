#!/bin/bash

echo ""
echo " ============================================"
echo "   CoolStay Hotel Demo - 로컬 실행"
echo " ============================================"
echo ""

# 스크립트가 위치한 폴더로 이동
cd "$(dirname "$0")"

# ── 1. Node.js 설치 확인 ──
if ! command -v node &>/dev/null; then
    echo " [!] Node.js가 설치되어 있지 않습니다."
    echo ""
    if command -v brew &>/dev/null; then
        echo "     Homebrew로 Node.js를 설치합니다..."
        brew install node
        if [ $? -ne 0 ]; then
            echo ""
            echo " [X] 설치에 실패했습니다."
            echo "     https://nodejs.org/ko 에서 직접 설치해주세요."
            echo ""
            read -p " 아무 키나 누르면 종료합니다..."
            exit 1
        fi
    else
        echo " [X] 아래 링크에서 Node.js를 설치한 뒤 다시 실행해주세요:"
        echo "     https://nodejs.org/ko"
        echo ""
        read -p " 아무 키나 누르면 종료합니다..."
        exit 1
    fi
fi

NODE_VER=$(node -v)
echo " [OK] Node.js ${NODE_VER} 감지됨"
echo ""

# ── 2. 의존성 설치 ──
if [ ! -d "node_modules" ]; then
    echo " [..] 최초 실행 - 패키지를 설치합니다 (1~2분 소요)"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo " [X] 패키지 설치에 실패했습니다."
        read -p " 아무 키나 누르면 종료합니다..."
        exit 1
    fi
    echo ""
    echo " [OK] 패키지 설치 완료"
    echo ""
fi

# ── 3. 개발 서버 실행 ──
echo " [..] 서버를 시작합니다..."
echo ""
echo " ============================================"
echo "   브라우저에서 http://localhost:3000/admin 접속"
echo "   종료하려면 이 창을 닫으세요"
echo " ============================================"
echo ""

# 서버 시작 후 브라우저 자동 오픈
(sleep 3 && open http://localhost:3000/admin) &
npm run dev
