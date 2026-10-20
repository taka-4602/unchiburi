/* Web Audio API サウンドシンセサイザー（外部音源完全不要） */
class PoopAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 「ぶりっ！」「ぷっ！」「ブフォッ！」などのオナラ・ぶりぶりプロシージャル合成
  playBuri(intensity = 1.0) {
    if (this.isMuted) return;
    this.init();

    const now = this.ctx.currentTime;
    const duration = 0.15 + Math.random() * 0.25;

    const osc = this.ctx.createOscillator();
    osc.type = Math.random() > 0.4 ? 'sawtooth' : 'triangle';

    const startFreq = 120 + Math.random() * 120 * intensity;
    const endFreq = 35 + Math.random() * 30;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(150, now + duration);

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(300, now);
    noiseFilter.Q.setValueAtTime(2.5, now);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.6 * intensity, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    noise.connect(noiseFilter);
    noiseFilter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    noise.start(now);
    osc.stop(now + duration);
    noise.stop(now + duration);
  }

  // 「水ポチャーン！」効果音
  playPlop() {
    if (this.isMuted) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // トイレの「ジャーーーッ！」流水洗浄音
  playFlush() {
    if (this.isMuted) return;
    this.init();

    const now = this.ctx.currentTime;
    const duration = 2.0;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(1200, now + 0.5);
    filter.frequency.linearRampToValueAtTime(250, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.4, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // フィーバーファンファーレ
  playFeverStart() {
    if (this.isMuted) return;
    this.init();

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  // 転生ファンファーレ（荘厳系）
  playPrestige() {
    if (this.isMuted) return;
    this.init();

    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    });
  }

  // レトロおならBGM
  toggleBgm() {
    this.init();
    if (this.isBgmPlaying) {
      clearInterval(this.bgmTimer);
      this.isBgmPlaying = false;
      return false;
    }
    this.isBgmPlaying = true;
    let step = 0;
    const bassLine = [65.41, 0, 73.42, 65.41, 82.41, 0, 98.0, 73.42];

    this.bgmTimer = setInterval(() => {
      if (this.isMuted || !this.isBgmPlaying) return;
      const freq = bassLine[step % bassLine.length];
      step++;
      if (freq > 0) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      }
    }, 240);
    return true;
  }
}

export const sound = new PoopAudioEngine();
