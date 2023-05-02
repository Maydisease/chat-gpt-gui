import {NgModule} from '@angular/core';

import {CommitIconComponent} from "./commitIcon.component";
import {FavoriteIconComponent} from "./favoriteIcon.component";
import {GearIconComponent} from "./gearIcon.component";
import {BookIconComponent} from "./bookIcon.component";
import {QuestionIconComponent} from "./questionIcon.component";
import {SmileIconComponent} from "./smileIcon.component";
import {DeleteIconComponent} from "./deleteIcon.component";
import {CloseIconComponent} from "./closeIcon.component";
import {BulbIconComponent} from "./bulbIcon.component";
import {CopyIconComponent} from "./copy.component";
import {RollBackIconComponent} from "./rollBackIcon.component";
import {ReloadIconComponent} from "./reloadIcon.component";
import {ProfileComponent} from "./profileIcon.component";
import {StopIconComponent} from "./stopIcon.component";
import {SendIconComponent} from "./sendIcon.component";

const iconsList = [
    StopIconComponent,
    ProfileComponent,
    CommitIconComponent,
    FavoriteIconComponent,
    GearIconComponent,
    BookIconComponent,
    QuestionIconComponent,
    SmileIconComponent,
    DeleteIconComponent,
    CloseIconComponent,
    BulbIconComponent,
    ReloadIconComponent,
    CopyIconComponent,
    RollBackIconComponent,
    SendIconComponent
];

@NgModule({
    imports: [],
    exports: iconsList,
    declarations: iconsList,
    providers: [],
})
export class IconsModule {
}
