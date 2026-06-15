import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TypoScene from '../components/TypoScene.vue';

vi.mock('../three/TypoSceneController', () => {
  const dispose = vi.fn();
  const setAutoRotate = vi.fn();
  const resetCamera = vi.fn();

  return {
    TypoSceneController: {
      create: vi.fn(() => ({
        setAutoRotate,
        resetCamera,
        dispose,
      })),
    },
  };
});

describe('TypoScene', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('mounts canvas and wires scene controller lifecycle', async () => {
    const wrapper = mount(TypoScene, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.find('canvas.scene-canvas').exists()).toBe(true);

    const { TypoSceneController } = await import('../three/TypoSceneController');
    expect(TypoSceneController.create).toHaveBeenCalledTimes(1);

    wrapper.unmount();

    const instance = vi.mocked(TypoSceneController.create).mock.results[0]?.value as {
      dispose: ReturnType<typeof vi.fn>;
    };
    expect(instance?.dispose).toHaveBeenCalledTimes(1);
  });
});
