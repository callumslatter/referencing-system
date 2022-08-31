import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { IFormattedText } from "./reference";
import { referenceSystemService } from "./referenceSystemService";

@Route("formatter")
export class referenceSystemController extends Controller {

  @Post()
  @SuccessResponse("201", "Created")
  public async formatText(@Body() requestBody: any): Promise<IFormattedText> {
    return new referenceSystemService().post(requestBody.inputText);
  }
}
