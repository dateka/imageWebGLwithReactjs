export const textureShader = `
	precision mediump float;

	// our texture (first bound texture)
	uniform sampler2D texture;

	// the texCoords passed in from the vertex shader.
	varying vec2 v_texCoord;

	void main() {
		gl_FragColor = texture2D(texture, v_texCoord);
	}
`;

export const saturation = `
  precision mediump float;

  uniform sampler2D texture;
  uniform float saturation;

  varying vec2 v_texCoord;

  void main() {
    vec4 texColor = texture2D(texture, v_texCoord);
    float average = (texColor.r + texColor.g + texColor.b) / 3.0;
    if (saturation > 0.0) {
        texColor.rgb += (average - texColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));
    } else {
        texColor.rgb += (average - texColor.rgb) * (-saturation);
    }
    gl_FragColor = texColor;
  }
`;

export const brightnessContrast = `
  precision mediump float;

  uniform sampler2D texture;
  uniform float brightness;
  uniform float contrast;

  varying vec2 v_texCoord;

  void main() {
    vec4 texColor = texture2D(texture, v_texCoord);
    texColor.rgb += brightness;
    if (contrast > 0.0) {
        texColor.rgb = (texColor.rgb - 0.5) / (1.0 - contrast) + 0.5;
    } else {
        texColor.rgb = (texColor.rgb - 0.5) * (1.0 + contrast) + 0.5;
    }
    gl_FragColor = vec4(texColor.rgb, 1.0);
  }
`;

export const vibrance = `
    precision mediump float;

    uniform sampler2D texture;
    uniform float vibrance;

    varying vec2 v_texCoord;

    void main() {
        vec4 color = texture2D(texture, v_texCoord);
        float average = (color.r + color.g + color.b) / 3.0;
        float mx = max(color.r, max(color.g, color.b));
        float amt = (mx - average) * (-vibrance * 3.0);
        color.rgb = mix(color.rgb, vec3(mx), amt);
        gl_FragColor = color;
    }
`;

export const sharpen = `
    precision mediump float;

    uniform sampler2D texture;
    uniform vec2 u_resolution;
    uniform float sharpen;

    varying vec2 v_texCoord;

    const int kernelSize = 3;
    const int kernelRadius = 1;

    void main() {
        // what % of canvas is worth 1 pixel on texture.
        vec2 texel = 1.0 / u_resolution;
        // sharpen kernel
        // float kernel[9] = float[9](0., -1., 0., -1., 5., -1., 0., -1., 0.);
        float kernel[9];
        kernel[0] = 0.;  kernel[1] = -1.; kernel[2] = 0.;
        kernel[3] = -1.; kernel[4] = 5.;  kernel[5] = -1.;
        kernel[6] = 0.;  kernel[7] = -1.; kernel[8] = 0.;

        vec4 kernelSum = vec4(0.0);
        for (int y = 0; y < kernelSize; y++) {
            for (int x = 0; x < kernelSize; x++) {
                vec2 offset = (vec2(x, y) - float(kernelRadius)) * texel;
                kernelSum += texture2D(texture, v_texCoord + offset) * kernel[y * kernelSize + x];
            }
        }
        gl_FragColor = mix(texture2D(texture, v_texCoord), kernelSum, sharpen);
    }
`;

export const exposure = `
    precision mediump float;

    uniform sampler2D texture;
    uniform float exposure;

    varying vec2 v_texCoord;

    void main() {
        vec4 color = texture2D(texture, v_texCoord);
        gl_FragColor = vec4(color.rgb * pow(2.0, exposure), color.a);
    }
`;

export const noise = `
    precision mediump float;

    uniform sampler2D texture;

    varying vec2 v_texCoord;

    float rand(vec2 co, float mix){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * mix);
    }

    void main() {
        gl_FragColor = texture2D(texture, v_texCoord) * vec4((1.0 - 0.3 * vec3(rand(v_texCoord, 7.0),rand(v_texCoord, 3.0), rand(v_texCoord, 11.0))), 1.0);
    }
`;

export const denoise = `
    precision mediump float;

    uniform sampler2D texture;
    uniform vec2 u_resolution;
    uniform float denoise;

    varying vec2 v_texCoord;

    const float exponent = 2.0;

    void main() {
        vec4 center = texture2D(texture, v_texCoord);
        vec4 color = vec4(0.0);
        float total = 0.0;
        for (float x = -4.0; x <= 4.0; x += 1.0) {
            for (float y = -4.0; y <= 4.0; y += 1.0) {
                vec4 sample = texture2D(texture, v_texCoord + vec2(x, y) / u_resolution);
                float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));
                // weight = pow(weight, 1000.0 - pow(denoise, 0.8) * 5000.0);
                float power = -2040.0 / (1.0 + exp(-1000.0 * denoise * 0.005)) + 2020.0;
                weight = pow(weight, power);
                color += sample * weight;
                total += weight;
            }
        }
        gl_FragColor = color / total;
    }
`;

export const opacity = `
    precision mediump float;
                    
    uniform sampler2D texture;

    uniform float opacity;

    varying vec2 v_texCoord;
        
    void main() {
        //float alpha = 1.0; //between 0.0 and 1.0
        gl_FragColor = vec4(texture2D(texture, v_texCoord).rgb, opacity);
    }
`;