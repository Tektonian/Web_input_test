import { Theme, Button, Flex, Container } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";


export interface StickyButtonProps {
    viewerType: number;
    innerText: string;
}

const renderButton = (props: StickyButtonProps) => {
    switch (props.viewerType) {
        case 1:
            return(<Button radius="large" variant="soft" size="4" color="orange"><MagnifyingGlassIcon/>{props.innerText}</Button>)    
        case 2:
            return(<Button radius="large" variant="soft" size="4" color="blue"><MagnifyingGlassIcon/> {props.innerText}</Button>)    
        default:
            return (<></>)
    }
}

const StickyButton = (props: StickyButtonProps) => (
    <Container position="sticky" bottom="10px" minWidth="300px" maxWidth="500px">
        <Flex direction="column" align="stretch" justify="center" pl="3" pr="3">
            {renderButton(props)}
        </Flex>
    </Container>
    );

export default StickyButton