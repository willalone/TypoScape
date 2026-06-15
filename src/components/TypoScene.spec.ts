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
    Object.defineProperty(HTMLCanvasElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 1024,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'clientHeight', {
      configurable: true,
      get: () => 768,
    });
  });

  it('mounts canvas and wires scene controller lifecycle', async () => {
    const wrapper = mount(TypoScene, {
      global: {
        plugins: [createPinia()],
      },
      attachTo: document.body,
    });

    expect(wrapper.find('canvas.scene-canvas').exists()).toBe(true);

    const { TypoSceneController } = await import('../three/TypoSceneController');

    await vi.waitFor(
      () => {
        expect(TypoSceneController).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );

    wrapper.unmount();

    const instance = vi.mocked(TypoSceneController).mock.instances[0];
    expect(instance?.dispose).toHaveBeenCalledTimes(1);
  });
});
