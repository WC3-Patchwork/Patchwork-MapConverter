import { expect } from 'chai';
import { describe } from 'mocha';
import { HexBuffer } from '../../src/wc3maptranslator/HexBuffer';
import { W3Buffer } from '../../src/wc3maptranslator/W3Buffer';


const TestDataType = {
    byte: 'byte', char: 'char', int: 'int', uint: 'uint', float: 'float', string: 'string'
} as const

const data = [
    { type: TestDataType.byte, value: 0x7 },
    { type: TestDataType.int, value: -2147483648 },
    { type: TestDataType.char, value: 'C' },
    { type: TestDataType.float, value: 12.123 },
    { type: TestDataType.int, value: -231 },
    { type: TestDataType.char, value: 'Crs\0' },
    { type: TestDataType.uint, value: 2311 },
    { type: TestDataType.char, value: 'A012' },
    { type: TestDataType.uint, value: 4294967295 },
    { type: TestDataType.string, value: "Abcdefg" },
    { type: TestDataType.uint, value: 0xFFFFFFFF }
]

const writeBuffer = new HexBuffer();
for (const dataLine of data) {
    switch (dataLine.type) {
        case TestDataType.byte:
            writeBuffer.addByte(dataLine.value as number);
            break;
        case TestDataType.char:
            if ((dataLine.value as string).length > 1) {
                writeBuffer.addChars(dataLine.value as string)
            } else {
                writeBuffer.addChar(dataLine.value as string)
            }
            break;
        case TestDataType.int:
            writeBuffer.addInt(dataLine.value as number)
            break;
        case TestDataType.uint:
            writeBuffer.addUInt(dataLine.value as number)
            break;
        case TestDataType.float:
            writeBuffer.addFloat(dataLine.value as number)
            break;
        case TestDataType.string:
            writeBuffer.addString(dataLine.value as string)
            break;
    }
}

const readBuffer = new W3Buffer(writeBuffer.getBuffer());
const testCases: ((index: number) => void)[] = [];
for (const dataLine of data) {
    let readValue;
    switch (dataLine.type) {
        case TestDataType.byte:
            readValue = readBuffer.readByte();
            break;
        case TestDataType.char:
            readValue = readBuffer.readChars((dataLine.value as string).length);
            break;
        case TestDataType.int:
            readValue = readBuffer.readInt();
            break;
        case TestDataType.uint:
            readValue = readBuffer.readUint();
            break;
        case TestDataType.float:
            readValue = readBuffer.readFloat();
            break;
        case TestDataType.string:
            readValue = readBuffer.readString()
            break;
    }
    testCases.push((index) => {
        it(`${dataLine.type} write & read should match`, () => {
            expect(readValue).to.equal(dataLine.value, `Failure at index ${index}`)
        })
    })
}
describe(`BufferIO operations`, () => {
    let i = 0;
    for (const testCase of testCases) {
        testCase(i++);
    }
})