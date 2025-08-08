# Firestore indexes (suggested)
- ideas: sourcePlatform ASC, uploadedAt DESC
- ideas: koreaFitScore DESC, uploadedAt DESC
- ideas: tags array-contains-any (Firestore UI에서 단일필드 + 쿼리 시 자동 제안 수락)

# Firestore rules (예시)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ideas/{id} {
      allow read: if true;
      allow create, update, delete: if request.auth != null
        && request.auth.token.email in ['ethancho12@gmail.com'];
    }
    match /votes/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /comments/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}