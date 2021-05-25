function initProgram(gl, vshader, fshader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    // create program
    let program = gl.createProgram();

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // use this program
    gl.useProgram(program);
    gl.program = program;

    function loadShader(gl, type, source) {
        let shader = gl.createShader(type);

        // Set the shader program
        gl.shaderSource(shader, source);
        // Compile the shader
        gl.compileShader(shader);

        return shader;
    }

    return program;
}

function createProgram(gl, vshader, fshader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    // create program
    let program = gl.createProgram();

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    return program;

    function loadShader(gl, type, source) {
        let shader = gl.createShader(type);

        // Set the shader program
        gl.shaderSource(shader, source);
        // Compile the shader
        gl.compileShader(shader);

        return shader;
    }
}

function setIndices(gl, indices) {
    let buffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function enableAttribute(gl, name, bufferAttribute, itemSize, program) {
    let attrIndex = gl.getAttribLocation(gl.program || program, name);
    let buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferAttribute, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attrIndex, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrIndex);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

function setUniformMatrix(gl, program, name, data) {
    const uniform = gl.getUniformLocation(program, name);
    gl.uniformMatrix4fv(uniform, false, data);
}

function enableInterLeavedAttribute(gl, array, bufferAttribute, stride) {

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferAttribute, gl.STATIC_DRAW);

    array.forEach(item => {
        let attrIndex = gl.getAttribLocation(gl.program, item.name);
        gl.vertexAttribPointer(attrIndex, item.size, gl.FLOAT, false, stride, item.offset);
        gl.enableVertexAttribArray(attrIndex);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
}


function loadTexture(gl, u_Sampler, image, unit, texture) {
    texture = texture || gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis

    // Activate texture unit0
    gl.activeTexture(gl[`TEXTURE${unit}`]);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, unit);

    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture parameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
}

function loadCubeTexture(gl, u_Sampler, images, unit, texture) {
    texture = texture || gl.createTexture();

    // Activate texture unit0
    gl.activeTexture(gl[`TEXTURE${unit}`]);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.uniform1i(u_Sampler, unit);

    const positions = [
        'POSITIVE_X', // 右
        'NEGATIVE_X', // 左
        'POSITIVE_Y', // 上
        'NEGATIVE_Y', // 下
        'POSITIVE_Z', // 前
        'NEGATIVE_Z', // 后
    ];

    for (let i = 0; i < positions.length; i++) {
        let position = positions[i];
        let image = images[i];
        gl.texImage2D(gl[`TEXTURE_CUBE_MAP_${position}`], 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    }

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function initFrameBuffer(gl, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT) {
    let frameBuffer, texture, depthBuffer;

    frameBuffer = gl.createFramebuffer();
    texture = gl.createTexture();

    frameBuffer.texture = texture;

    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    // Attach the texture and the renderbuffer object to the FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // Unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return frameBuffer;
}

async function loadImage(url) {
    return new Promise(async resolve => {
        const response = await fetch(url);
        const image = new Image();
        const fileReader = new FileReader();

        fileReader.readAsDataURL(await response.blob());
        fileReader.onload = (ev) => {
            image.src = ev.target.result;
            resolve(image);
        };
    });
}
