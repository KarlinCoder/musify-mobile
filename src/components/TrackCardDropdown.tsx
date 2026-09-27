import { useState } from "react";
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text as ComposeText,
  RNHostView,
} from "@expo/ui/jetpack-compose";
import DetailsButton from "./DetailsButton";

interface Props {
  track: MFTrack;
}

export default function TrackCardDropdown({ track }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isMenuExpanded}
        color={"#0d0d0d"}
        onDismissRequest={() => setIsMenuExpanded(false)}
      >
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <DetailsButton onPress={() => setIsMenuExpanded(true)} />
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem
            onClick={() => {
              setIsFavorite((prev) => !prev);
              setIsMenuExpanded(false);
            }}
          >
            <DropdownMenuItem.Text>
              <ComposeText>
                {isFavorite ? "Guardado" : "Guardar"}
              </ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setIsMenuExpanded(false);
              console.log("Compartir", track.id);
            }}
          >
            <DropdownMenuItem.Text>
              <ComposeText>Compartir</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
