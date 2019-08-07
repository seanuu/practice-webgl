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

function enableAttribute(gl, name, bufferAttribute, itemSize, program) {
    let attrIndex = gl.getAttribLocation(gl.program || program, name);
    let buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferAttribute, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attrIndex, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrIndex);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
}


function loadTexture(gl, u_Sampler, image, unit) {
    let texture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
    // Activate texture unit0
    gl.activeTexture(gl[`TEXTURE${unit}`]);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, unit);
}
