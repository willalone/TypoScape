export interface LetterMeta {
  role: string;
  weight: string;
}

export const LETTER_INFO: Record<string, LetterMeta> = {
  T: { role: 'Вертикальная опора', weight: '28%' },
  Y: { role: 'Развилка формы', weight: '24%' },
  P: { role: 'Замкнутая петля', weight: '22%' },
  O: { role: 'Круговое замыкание', weight: '26%' },
};
