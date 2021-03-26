export const createShader = (gl, shaderSource, shaderType) => {
	// Create the shader object
	const shader = gl.createShader(shaderType);

	// Set the shader source code.
	gl.shaderSource(shader, shaderSource);

	// Compile the shader
	gl.compileShader(shader);

	// Check if it compiled
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!success) {
		// Something went wrong during compilation; get the error
		throw new Error("could not compile shader:" + gl.getShaderInfoLog(shader));
	}

	// console.log("shader compile!!!", shaderSource, success);

	return shader;
};

export const createVertexShader = (gl, shaderSource) => createShader(gl, shaderSource, gl.VERTEX_SHADER);
export const createFragmentShader = (gl, shaderSource) => createShader(gl, shaderSource, gl.FRAGMENT_SHADER);

export const createShaderProgram = (gl, vertexShader, fragmentShader) => {
	// create a program.
	const program = gl.createProgram();

	// attach the shaders.
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	// link the program.
	gl.linkProgram(program);

	// Check if it linked.
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		// something went wrong with the link
		throw new Error("program failed to link:" + gl.getProgramInfoLog(program));
	}

	return program;
};

export const createShaderProgramFromSource = (gl, vertexShaderSrc, fragmentShaderSrc) => {
	const vertShader = createVertexShader(gl, vertexShaderSrc);
	const fragShader = createFragmentShader(gl, fragmentShaderSrc);
	return createShaderProgram(gl, vertShader, fragShader);
};

export const createFrameBuffer = (gl, width, height) => {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set up texture so we can render any size image and so we are working with pixels.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	// Create a framebuffer
	var frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

	// Attach a texture to it.
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

	return {
		frameBuffer,
		texture
	};
};
