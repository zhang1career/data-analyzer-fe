import {TermRelationVo, TermVo} from "@/pojo/vo/TermVo.ts";
import {TermModel, TermRelationModel} from "@/models/TermModel.ts";
import {AccessVectorVo, GraphEdgeVo} from "@/pojo/vo/GraphVo.ts";
import {TermRelationOpt} from "@/pojo/opt/TermRelationOpt.ts";
import {TermDto, TermRelationDto} from "@/pojo/dto/TermDto.ts";
import {LabeledValueProps} from "@/defines/combines/LabeledValueProps.ts";
import {EMPTY_STRING} from "@/consts/StrConst.ts";


/***********************************************************************************************************************
 * dto
 **********************************************************************************************************************/
export function modelToDto(m: TermModel): TermDto {
  return new TermDto(m.id, m.name, m.content, m.relation.map(termRelationModelToTermRelationDto));
}

export function termRelationModelToTermRelationDto(m: TermRelationModel): TermRelationDto {
  return new TermRelationDto(m.destName, m.relationType, m.isReverse);
}


/***********************************************************************************************************************
 * vo
 **********************************************************************************************************************/
export function termRelationVoToString(vo: TermRelationVo) {
  return vo.ad ? `<-${vo.a}- ${vo.d}` : `-${vo.a}-> ${vo.d}`;
}


/***********************************************************************************************************************
 * model
 **********************************************************************************************************************/
export function voToModel(vo: TermVo): TermModel {
  return {
    id: vo.id,
    name: vo.name,
    content: vo.content,
    relation: termVoToTermRelationModelList(vo),
    tagList: [],
  };
}

export function voToModelBatch(vos: TermVo[]): TermModel[] {
  return vos.map(voToModel);
}

function termVoToTermRelationModelList(vo: TermVo): TermRelationModel[] {
  const relationList: TermRelationModel[] = [];

  const srcTermMap = vo.src_term;
  if (Object.keys(srcTermMap).length !== 0) {
    Object.values(srcTermMap).forEach((_v) => {
      Object.values(_v.r as { [key: number]: GraphEdgeVo }).forEach((_vv) => {
        relationList.push({
          id: _vv.id,
          destId: _v.id,
          destName: _v.name,
          relationType: _vv.l,
          isReverse: true,
          speechType: _vv.sp,
        });
      });
    });
  }

  const destTermMap = vo.dest_term;
  if (Object.keys(destTermMap).length !== 0) {
    Object.values(destTermMap).forEach((_v) => {
      Object.values(_v.r as { [key: number]: GraphEdgeVo }).forEach((_vv) => {
        relationList.push({
          id: _vv.id,
          destId: _v.id,
          destName: _v.name,
          relationType: _vv.l,
          isReverse: false,
          speechType: _vv.sp,
        });
      });
    });
  }

  return relationList;
}

export function termRelationModelToString(m: TermRelationModel): string {
  return m.isReverse ? `<-${m.relationType}- ${m.destName}` : `-${m.relationType}-> ${m.destName}`
}


/***********************************************************************************************************************
 * opt
 **********************************************************************************************************************/
export function accessVectorVoToTermRelationOptList(vo: AccessVectorVo): LabeledValueProps<string>[] {
  return vo.map(termRelationVoToTermRelationOpt);
}

function termRelationVoToTermRelationOpt(vo: TermRelationVo): LabeledValueProps<string> {
  return {
    label: termRelationVoToString(vo),
    value: JSON.stringify({
      dn: vo.d,
      r: vo.a,
      dir: vo.ad,
    } as TermRelationOpt),
  };
}

export function termRelationOptToTermRelationModel(opt: TermRelationOpt): TermRelationModel {
  return {
    id: opt.i ?? 0,
    destId: opt.di ?? 0,
    destName: opt.dn ?? EMPTY_STRING,
    relationType: opt.r,
    isReverse: opt.dir,
    speechType: opt.sp ?? 0,
  };
}