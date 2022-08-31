import { request } from "http";
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { IFormattedText } from "./reference";
import { referenceSystemService } from "./referenceSystemService";

@Route("references")
export class referenceSystemController extends Controller {
  @Get()
  public async sayHello(): Promise<IFormattedText> {
    return new referenceSystemService().get();
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async formatText(@Body() requestBody: any): Promise<IFormattedText> {
    return new referenceSystemService().post(requestBody.inputText);
  }
}
