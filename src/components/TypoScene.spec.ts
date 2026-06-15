import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TypoScene from '../components/TypoScene.vue';

vi.mock('../three/TypoSceneController', () => {
  const dispose = vi.fn();
  const setAutoRotate = vi.fn();
  const setSoundEnabled = vi.fn();
  const resetCamera = vi.fn();

  return {
    TypoSceneController: vi.fn(
      class TypoSceneControllerMock {
        setAutoRotate = setAutoRotate;

        setSoundEnabled = setSoundEnabled;

        resetCamera = resetCamera;

        dispose = dispose;
      },
    ),
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

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    await wrapper.vm.$nextTick();

    const { TypoSceneController } = await import('../three/TypoSceneController');
    expect(TypoSceneController).toHaveBeenCalledTimes(1);

    wrapper.unmount();

    const instance = vi.mocked(TypoSceneController).mock.instances[0];
    expect(instance?.dispose).toHaveBeenCalledTimes(1);
  });
});
