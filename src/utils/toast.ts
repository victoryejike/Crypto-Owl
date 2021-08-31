import { ToastColor } from '@type/enums';
import { IToastOption } from '@type/interface';
import BaseToast from '@ui/BaseToast.vue';
import { createToast, withProps } from 'mosha-vue-toastify';

import 'mosha-vue-toastify/dist/style.css';

const toast = (data: IToastOption): () => void => {
  const { close } = createToast(withProps(BaseToast,
    {
      title: data.title,
      description: data.description,
      type: data.type,
    }), {
    toastBackgroundColor: data.type ? ToastColor[data.type] : undefined,
    timeout: data.timeout || 5000,
  });

  return close;
};

export default toast;
