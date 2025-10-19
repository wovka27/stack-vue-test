import { type App, type ObjectDirective } from 'vue';
import IMask, { type InputMask, type FactoryArg, type MaskedOptions } from 'imask';

export type BindingValue = MaskedOptions | 'phone' | null;

const PRESETS: Record<string, MaskedOptions> = {
  phone: {
    mask: '+0 000 000 00 00',
    overwrite: true,
  },
};

const IMASK_KEY = '__imask__';

const getMaskInstance = (el: HTMLElement): InputMask<FactoryArg> | undefined => {
  return el[IMASK_KEY] as InputMask<FactoryArg> | undefined;
};

const setMaskInstance = (el: HTMLElement, inst: InputMask<FactoryArg> | undefined) => {
  el[IMASK_KEY] = inst;
};

const normalizeOptions = (value: BindingValue): FactoryArg | null => {
  if (!value) return null;
  if (typeof value === 'string') {
    const preset = PRESETS[value];
    if (preset) return preset as FactoryArg;
    return { mask: value } as FactoryArg;
  }
  return value as FactoryArg;
};

const dispatchInputEvent = (el: HTMLInputElement | HTMLTextAreaElement | HTMLElement) => {
  el.dispatchEvent(new Event('input', { bubbles: true }));
};

const maskDirective: ObjectDirective<HTMLElement, BindingValue> = {
  mounted(el, binding) {
    const opts = normalizeOptions(binding.value);
    if (!opts) return;

    const inputEl = el as HTMLInputElement | HTMLTextAreaElement;
    const inst = IMask(inputEl, opts as FactoryArg);
    setMaskInstance(el, inst);

    inst.on('accept', () => {
      if ('value' in inputEl) inputEl.value = inst.value as string;
      dispatchInputEvent(inputEl);
    });
  },

  updated(el, binding) {
    const opts = normalizeOptions(binding.value);
    const inst = getMaskInstance(el);
    const inputEl = el as HTMLInputElement | HTMLTextAreaElement;

    if (!opts && inst) {
      inst.destroy();
      setMaskInstance(el, undefined);
      return;
    }

    if (!inst && opts) {
      const newInst = IMask(inputEl, opts as FactoryArg);
      setMaskInstance(el, newInst);
      newInst.on('accept', () => {
        if ('value' in inputEl) inputEl.value = newInst.value as string;
        dispatchInputEvent(inputEl);
      });
      return;
    }

    if (inst && opts) {
      try {
        inst.updateOptions(opts as Parameters<typeof inst.updateOptions>[number]);
      } catch {
        inst.destroy();
        const newInst = IMask(inputEl, opts as FactoryArg);
        setMaskInstance(el, newInst);
        newInst.on('accept', () => {
          if ('value' in inputEl) inputEl.value = newInst.value as string;
          dispatchInputEvent(inputEl);
        });
      }
    }
  },

  beforeUnmount(el) {
    const inst = getMaskInstance(el);
    if (inst) {
      inst.destroy();
      setMaskInstance(el, undefined);
    }
  },
};

export default {
  install(app: App) {
    app.directive('imask', maskDirective);
  },
};

export { maskDirective };
