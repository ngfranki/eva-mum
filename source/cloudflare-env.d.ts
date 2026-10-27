declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    MUM_USER_ID?: string;
    MUM_PASSPHRASE_HASH?: string;
    MUM_SESSION_SECRET?: string;
    MUM_ULTRAHUMAN_TOKEN?: string;
    MUM_ULTRAHUMAN_USER_ID?: string;
    BUCKET?: R2Bucket;
  }
}
