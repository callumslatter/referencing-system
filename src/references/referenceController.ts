import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { IFormattedText } from "./reference";
import { referenceService } from "./referenceService";

@Route("formatter")
export class referenceController extends Controller {
  @Post()
  @SuccessResponse("201", "Created")
  public async formatText(@Body() requestBody: any): Promise<IFormattedText> {
    return new referenceService().post(requestBody.inputText);
  }
}
