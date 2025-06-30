export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[A-Za-zА-Яа-яҐґЄєІіЇї'’.,-]{2,}(?: [A-Za-zА-Яа-яҐґЄєІіЇї'’.,-]{2,}){1,2}$/, // Full name with at least two parts with ,.-
  password: /^.{6,}$/, // At least 6 characters
  files: /^.+\.txt$/, // for export files
  title: /^[A-Za-zА-Яа-яҐґЄєІіЇї0-9\s.,:'"?!()-]{2,100}$/, // movie title
  actorName: /^[A-Za-zА-Яа-яҐґЄєІіЇї'’.,-]+(?: [A-Za-zА-Яа-яҐґЄєІіЇї'’.,-]+)+$/, // Full name with at least two parts
};
