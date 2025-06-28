export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[A-Za-z]{2,}(?: [A-Za-z]{2,})?$/,
  password: /^.{6,}$/, // At least 6 characters
  files: /^.+\.txt$/, // for export files
  title: /^[A-Za-z0-9\s.,:'"-]{2,100}$/, // flexible movie titles
  actorName: /^[A-Za-z]+(?: [A-Za-z]+)+$/, // "First Last", min 2 words
};
