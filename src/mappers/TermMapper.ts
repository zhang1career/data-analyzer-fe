import {TermRelationVo, TermVo} from "@/pojo/vo/TermVo.ts";
import {TermModel, TermRelationModel} from "@/models/TermModel.ts";
import {AccessVectorVo, GraphEdgeVo} from "@/pojo/vo/GraphVo.ts";
import {TermRelationOpt} from "@/pojo/opt/TermRelationOpt.ts";
import {TermDto, TermRelationDto} from "@/pojo/dto/TermDto.ts";


/***********************************************************************************************************************
 * dto
 **********************************************************************************************************************/
export function modelToDto(m: TermModel): TermDto {
  return new TermDto(m.id, m.name, m.content, m.relation.map(termRelationModelToTermRelationDto));
}

export function termRelationModelToTermRelationDto(m: TermRelationModel): TermRelationDto {
  return new TermRelationDto(m.name, m.relation_type, m.is_reverse);
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
  };
}

function termVoToTermRelationModelList(vo: TermVo): TermRelationModel[] {
  const relationList: TermRelationModel[] = [];

  const srcTermMap = vo.src_term;
  if (Object.keys(srcTermMap).length !== 0) {
    Object.values(srcTermMap).forEach((_v) => {
      const destNodeName = _v.name;
      Object.values(_v.r as { [key: number]: GraphEdgeVo }).forEach((_vv) => {
        relationList.push({
          id: _vv.id,
          name: destNodeName,
          relation_type: _vv.l,
          is_reverse: true
        });
      });
    });
  }

  const destTermMap = vo.dest_term;
  if (Object.keys(destTermMap).length !== 0) {
    Object.values(destTermMap).forEach((_v) => {
      const destNodeName = _v.name;
      Object.values(_v.r as { [key: number]: GraphEdgeVo }).forEach((_vv) => {
        relationList.push({
          id: _vv.id,
          name: destNodeName,
          relation_type: _vv.l,
          is_reverse: false
        });
      });
    });
  }

  return relationList;
}

export function termRelationModelToString(m: TermRelationModel): string {
  return m.is_reverse ? `<-${m.relation_type}- ${m.name}` : `-${m.relation_type}-> ${m.name}`
}


/***********************************************************************************************************************
 * opt
 **********************************************************************************************************************/
export function accessVectorVoToTermRelationOptList(vo: AccessVectorVo): TermRelationOpt[] {
  return vo.map(termRelationVoToTermRelationOpt);
}

function termRelationVoToTermRelationOpt(vo: TermRelationVo): TermRelationOpt {
  return {
    label: termRelationVoToString(vo),
    value: {
      id: 0,
      relation_type: vo.a,
      is_reverse: vo.ad,
      name: vo.d,
    } as TermRelationModel,
  } as TermRelationOpt;
}