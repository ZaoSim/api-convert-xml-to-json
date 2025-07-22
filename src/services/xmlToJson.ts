import { XMLParser } from 'fast-xml-parser';

export function xmlToJson(xml: string): any {
    try{
        const parser = new XMLParser();
        const json = parser.parse(xml);
        return json;
    }catch(error){
        throw new Error('Erro ao converter XML para JSON: ' + error);
    }
}

export function isFileArray(files: any): files is Express.Multer.File[] {
    return Array.isArray(files);
}