import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useCheckBoxStore } from "../use-chat/Stores/CheckBoxStore";
import { useRequestQuery } from "../use-chat/useRequest";
import { Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseButton from "./ChatRoomHeader/CloseButton";
import DeleteButton from "./ChatRoomHeader/DeleteButton";
import { ChatRoomHeader as ChatRoomHeaderComponent } from "@mesh/web_component";
import { MenuButton } from "@mesh/web_component";
import RequestApproveDiagram from "./ChatRoomHeader/RequestApprove";
import RequestFinishDiagram from "./ChatRoomHeader/RequestFinish";
import { RequestEnum } from "@mesh/api_spec/enum";
export const ChatRoomHeader = () => {
    const activeRequest = useChatRoomStore((state) => state.activeRequest);
    const checkBoxMode = useCheckBoxStore((state) => state.checkBoxMode);
    const changeCheckBoxMode = useCheckBoxStore((state) => state.changeMode);
    const { updateProvider } = useRequestQuery();

    const mutateUpdateProvider = updateProvider.mutate;

    const handleBack = () => {
        window.history.back();
    };

    return (
        <Box
            width="100%"
            height="fit-content"
            position="sticky"
            top="0"
            zIndex="999"
        >
            <ChatRoomHeaderComponent
                key={activeRequest?.requestId}
                title={activeRequest?.title ?? ""}
                menuItemList={
                    checkBoxMode === false
                        ? [
                              <MenuButton.MenuButton trigger={<MenuIcon />}>
                                  <MenuButton.Item>
                                      {activeRequest?.requestStatus ===
                                      RequestEnum.REQUEST_STATUS_ENUM
                                          .CONTRACTED ? (
                                          <RequestFinishDiagram />
                                      ) : (
                                          <RequestApproveDiagram />
                                      )}
                                  </MenuButton.Item>
                              </MenuButton.MenuButton>,
                          ]
                        : [
                              <Button
                                  color="inherit"
                                  onClick={() => mutateUpdateProvider()}
                              >
                                  선택 변경
                              </Button>,
                              <CloseButton
                                  onClick={() => changeCheckBoxMode(false)}
                              />,
                              <MenuButton.MenuButton trigger={<MenuIcon />}>
                                  <MenuButton.ItemWithClose>
                                      {<DeleteButton onClick={() => 0} />}
                                  </MenuButton.ItemWithClose>
                              </MenuButton.MenuButton>,
                          ]
                }
                onBackClick={handleBack}
            />
        </Box>
    );
};
