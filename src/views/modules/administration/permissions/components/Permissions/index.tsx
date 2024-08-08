/* eslint-disable react-hooks/exhaustive-deps */
import { useHistory } from "react-router-dom"
import { Button } from "src/components"
import { ADMINISTRATION_SEE_ALL_PERMISSIONS } from "src/layouts/typePath"
import { PickList } from 'primereact/picklist';
import { Row } from "src/styles"
import { ButtonContainer, Container } from "./style"
import { useEffect, useState } from "react";
import { permissionsUser } from "../../static";
import { PermissionUser } from "../../type";
import { LAYOUT_IS_MODIFIED_FIELDS } from "src/store/actions";
import { useDispatch } from "react-redux";

type PermissionsProps = {
  onSubmit: () => void
  setPermissionsValues: React.Dispatch<React.SetStateAction<PermissionUser[]>>
  targetPermission?: PermissionUser[]
}

export const Permissions: React.FC<PermissionsProps> = ({ onSubmit, setPermissionsValues, targetPermission }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [source, setSource] = useState<PermissionUser[]>([] as PermissionUser[]);
  const [target, setTarget] = useState<PermissionUser[]>(targetPermission || [] as PermissionUser[]);

  const onClear = () => {
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {},
        url: ''
      },
    })
  }

  useEffect(() => {
    setSource(permissionsUser)
  }, []);

  useEffect(() => {
    setPermissionsValues(target)
  }, [target]);

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const onHandleClose = () => {
    history.push(ADMINISTRATION_SEE_ALL_PERMISSIONS)
    onClear()
  }

  const itemTemplate = (item: PermissionUser) => {
    return (
      <section>
        <div style={{ display: 'flex', gap: '5px' }}>
          {item?.icon}
          <span >{item?.name}</span>
        </div>
      </section>
    );
  };

  return (
    <Container>
      <Row justifyContent="center" alignItems="center">
        <PickList
          source={source}
          target={target}
          onChange={onChange}
          itemTemplate={itemTemplate}
          breakpoint="300px"
          filter
          filterBy="name"
          sourceHeader="Permissões disponíveis"
          targetHeader="Selecionados"
          sourceStyle={{ height: '30rem' }}
          showSourceControls={false}
          targetStyle={{ height: '30rem' }} />
      </Row>
      <Row justifyContent="center" alignItems="center">
        <ButtonContainer>
          <Button
            textButton="Salvar"
            variant="contained"
            size="large"
            icon="add"
            onClick={onSubmit}
          />
          <Button
            textButton="Cancelar"
            variant="outlined"
            size="large"
            icon="back"
            onClick={onHandleClose}
          />
        </ButtonContainer>
      </Row>
    </Container>
  )
}